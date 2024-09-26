import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from './entities/media.entity';
import { ConfigService } from '@nestjs/config';
import { addingFile } from 'src/common/utils/addingFile';
import { handleResponseRemoveKey } from 'src/common/utils/handleResponse';
import { GetParamsMediaDto } from './dto/get-media.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private configService: ConfigService,
  ) {}

  async create(image: Express.Multer.File) {
    if (!image) {
      throw new UnprocessableEntityException('Image không tồn tại');
    }

    const imageValue = await addingFile(image, '/media', this.configService);
    const newCompany = await this.mediaRepository.save({
      name: imageValue.name,
      image: image ? imageValue.image : null,
    });
    return handleResponseRemoveKey({
      ...newCompany,
      image: image ? imageValue.imageFullPath : null,
    });
  }

  async findAll(qs: GetParamsMediaDto) {
    const { page, per_page, orderByField, order, name } = qs;
    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .select(['media.id', 'media.name', 'media.image'])
      .orderBy(`media.${orderByField || 'id'}`, order || 'DESC');

    if (name) {
      queryBuilder.andWhere('company.name LIKE :name', { name: `%${name}%` });
    }

    if (page && per_page) {
      const domain = this.configService.get<string>('DOMAIN_API');
      const port = this.configService.get<number>('PORT_API');
      // Pagination
      const options: IPaginationOptions = {
        page,
        limit: per_page,
        route: `${domain}${port ? `:${port}` : ''}/api/v1/media`,
      };

      const { items, meta, ...companies } = await paginate<Media>(
        queryBuilder,
        options,
      );

      const from = (page - 1) * per_page + 1;
      const to = Math.min(page * per_page, meta.totalItems);

      return {
        response: { count: items.length, media_list: items },
        meta: { ...meta, from, to },
        ...companies,
      };
    } else {
      const items = await queryBuilder.getMany();

      return {
        response: { count: items.length, media_list: items },
        meta: {
          totalItems: items.length,
          totalPages: 1,
          currentPage: 1,
          from: 1,
          to: items.length,
        },
      };
    }
  }
}
