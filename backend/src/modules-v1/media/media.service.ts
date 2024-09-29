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
        image: image ? imageValue.image : null,
        created_by: user,
        updated_by: user,
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
        'media.image',
        'media.created_at',
        'media.updated_at',
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

  async moveToTrash(ids: number[]) {
    // const today = new Date().toISOString().split('T')[0];
    const publicDir = path.resolve(__dirname, '../../../public');
    const trashDir = path.join(publicDir, 'trash', 'images', 'media');

    // Tạo thư mục trash nếu chưa tồn tại
    fs.mkdirSync(path.join(publicDir, 'trash'), { recursive: true });
    fs.mkdirSync(trashDir, { recursive: true });

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
        if (!media || !media.image) return;

        const oldPath = path.join(publicDir, media.image);
        const newPath = path.join(trashDir, path.basename(media.image));
        // Di chuyển file
        await fs.promises.rename(oldPath, newPath);

        // const trash = await this.trashRepository.save({
        //   name: media.name,
        //   image: media.image,
        // });

        // Cập nhật cơ sở dữ liệu
        // await this.mediaRepository.update(id, {
        //   isActive: false,
        //   isDeleted: true,
        //   deleted_at: new Date(),
        // });
      }),
    );

    return 'Xóa thành công';
  }

  emptyTrash() {
    // const publicDir = path.resolve(__dirname, '../../../public');
    // const trashDir = path.join(publicDir, 'trash');
    // console.log('trashDir :>> ', trashDir);
    // // if (fs.existsSync(trashDir)) {
    // //   fs.rmSync(trashDir, { recursive: true });
    // // }
    return 'Xóa thanh cong';
  }
}
