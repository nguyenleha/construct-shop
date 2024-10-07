import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { ConfigService } from '@nestjs/config';
import { GetParamsMediaDto } from './dto/get-media.dto';
import { PaginationService } from 'src/common/utils/pagination.service';
import { IUser, PaginationResponse } from 'src/interfaces/common.interface';
import { CommonService } from 'src/common/utils/Common.service';
import path from 'path';
import fs from 'fs';
import { Trash } from './entities/trash.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @InjectRepository(Trash)
    private readonly trashRepository: Repository<Trash>,
    private configService: ConfigService,
    private commonService: CommonService,
    private paginationService: PaginationService,
  ) {}

  async create(
    images: Express.Multer.File[],
    user: IUser,
  ): Promise<{ count: number; media_list: Media[] }> {
    if (!images.length) {
      throw new UnprocessableEntityException('Image không tồn tại');
    }
    const processImage = async (image: Express.Multer.File, index?: number) => {
      const imageValue = await this.commonService.addingFile(
        image,
        '/media',
        this.configService,
        index,
      );
      const newMedia = await this.mediaRepository.save({
        name: imageValue.name,
        url: image ? imageValue.image : null,
        created_by: user,
      });
      return this.commonService.removeKey({
        ...newMedia,
        image: image ? imageValue.imageFullPath : null,
      });
    };

    // Nếu chỉ có 1 hình ảnh
    if (images.length === 1) {
      return processImage(images[0]);
    }

    // Nếu có nhiều hình ảnh
    const media_list = await Promise.all(images.map(processImage));
    return {
      count: media_list.length,
      media_list,
    };
  }

  async findAll(qs: GetParamsMediaDto): Promise<PaginationResponse<Media>> {
    const { page, per_page, orderByField, order, name } = qs;
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .select([
        'media.id',
        'media.name',
        'media.url',
        'media.created_at',
      ])
      .orderBy(`media.${orderByField || 'id'}`, order || 'DESC');

    if (name) {
      queryBuilder.andWhere('company.name LIKE :name', { name: `%${name}%` });
    }

    return await this.paginationService.paginateEntity<Media>(
      queryBuilder,
      page,
      per_page,
      '/api/v1/media',
      this.configService,
    );
  }

  async moveToTrash(ids: number[], user: IUser) {
    const { publicDir, trashDir } = this.commonService.createFolderImageTrash();

    // Kiểm tra có đủ hình ảnh trong ids
    await Promise.all(
      ids.map(async (id) => {
        const mediaExists = await this.mediaRepository.exist({
          where: { id },
        });
        if (!mediaExists) {
          throw new UnprocessableEntityException('Media không tìm thấy');
        }
      }),
    );

    // Xóa hình ảnh
    await Promise.all(
      ids.map(async (id) => {
        const media = await this.mediaRepository.findOne({
          where: { id },
        });
        if (!media || !media.url) return;

        const oldPath = path.join(publicDir, media.url);
        const newPath = path.join(trashDir, path.basename(media.url));
        // Di chuyển file
        await fs.promises.rename(oldPath, newPath);

        await this.trashRepository.save({
          name: media.name,
          image: media.url,
          created_by: user,
        });

        // Cập nhật cơ sở dữ liệu
        await this.mediaRepository.delete(id);
      }),
    );

    return 'Xóa thành công';
  }

  async restore(ids: number[], user: IUser) {
    const { publicDir, trashDir } = this.commonService.createFolderImageTrash();

    await Promise.all(
      ids.map(async (id) => {
        const trashExists = await this.trashRepository.exist({
          where: { id },
        });
        if (!trashExists) {
          throw new UnprocessableEntityException('Media không tìm thấy');
        }
      }),
    );

    await Promise.all(
      ids.map(async (id) => {
        const media = await this.trashRepository.findOne({
          where: { id },
        });
        if (!media || !media.url) return;

        const newPath = path.join(publicDir, media.url);
        const oldPath = path.join(trashDir, path.basename(media.url));
        // Di chuyển file
        await fs.promises.rename(oldPath, newPath);

        await this.mediaRepository.save({
          name: media.name,
          image: media.url,
          created_by: user,
        });

        // Cập nhật cơ sở dữ liệu
        await this.trashRepository.delete(id);
      }),
    );

    return 'Retore thành công';
  }
  async emptyTrash(ids: number[]) {
    const { trashDir } = this.commonService.createFolderImageTrash();

    await Promise.all(
      ids.map(async (id) => {
        const trashExists = await this.trashRepository.exist({
          where: { id },
        });
        if (!trashExists) {
          throw new UnprocessableEntityException('Media không tìm thấy');
        }
      }),
    );

    await Promise.all(
      ids.map(async (id) => {
        const media = await this.trashRepository.findOne({
          where: { id },
        });
        if (!media || !media.url) return;
        const oldPath = path.join(trashDir, path.basename(media.url));
        await fs.promises.rm(oldPath, { recursive: true, force: true });
        await this.trashRepository.delete(id);
      }),
    );
    return 'Xóa thanh cong';
  }

  async emptyTrashAll() {
    const { trashDir } = this.commonService.createFolderImageTrash();
    await fs.promises.rm(trashDir, { recursive: true, force: true });
    await this.trashRepository.clear();

    return 'Xóa thanh cong';
  }
}
