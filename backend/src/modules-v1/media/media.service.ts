import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { ConfigService } from '@nestjs/config';
import { GetParamsMediaDto } from './dto/get-media.dto';
// import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';
import { PaginationService } from 'src/common/utils/pagination.service';
import { PaginationResponse } from 'src/interfaces/common.interface';
import { CommonService } from 'src/common/utils/Common.service';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private configService: ConfigService,
    private commonService: CommonService,
    private paginationService: PaginationService,
  ) {}

  async create(
    images: Express.Multer.File[],
  ): Promise<{ count: number; media_list: Media[] }> {
    if (!images.length) {
      throw new UnprocessableEntityException('Image không tồn tại');
    }

    const processImage = async (image: Express.Multer.File) => {
      const imageValue = await this.commonService.addingFile(
        image,
        '/media',
        this.configService,
      );
      const newMedia = await this.mediaRepository.save({
        name: imageValue.name,
        image: image ? imageValue.image : null,
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
      .select(['media.id', 'media.name', 'media.image'])
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
}
