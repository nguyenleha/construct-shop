import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from './entities/brand.entity';
import { Repository } from 'typeorm';
import { Media } from '../media/entities/media.entity';
import { handleResponseRemoveKey } from 'src/common/utils/handleResponse';
import { GetParamsBrandDto } from './dto/get-brand.dto';
import { PaginationService } from 'src/common/utils/pagination.service';
import { ConfigService } from '@nestjs/config';
import { IUser } from 'src/interfaces/common.interface';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand) private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Media) private readonly mediaRepository: Repository<Media>,
    private configService: ConfigService,
    private paginationService: PaginationService,
  ) { }

  async checkBrandId(request: { where: { id?: number }, relations?: string[] }) {
    const brand = await this.brandRepository.findOne(request);
    if (!brand) {
      throw new UnprocessableEntityException('Brand không tồn tại');
    }
    return brand;
  }

  async checkBrandNameExist(name: string) {
    const brandName = await this.brandRepository.exists({ where: { name } });
    if (brandName) {
      throw new UnprocessableEntityException('Brand name đã được sử dụng');
    }
  }

  async checkMediaId(id: number) {
    const media = await this.mediaRepository.findOne({ where: { id } })
    if (!media) {
      throw new UnprocessableEntityException('Media Không tồn tại');
    }
    return media;
  }

  async create(createBrandDto: CreateBrandDto, user: IUser) {
    const { name, mediaId } = createBrandDto
    await this.checkBrandNameExist(name)
    const media = await this.checkMediaId(mediaId)
    const newBrand = await this.brandRepository.save({
      name,
      media,
      created_by: user,
      updated_by: user
    })
    return handleResponseRemoveKey(newBrand);
  }

  async findAll(qs: GetParamsBrandDto) {
    const { page, per_page, orderByField, order, name, mediaId } = qs;
    const queryBuilder = this.brandRepository
      .createQueryBuilder('brand')
      .leftJoinAndSelect('brand.media', 'media')
      .select([
        'brand.id',
        'brand.name',
        'brand.created_at',
        'brand.updated_at',
        'media.id',
        'media.name',
        'media.url',
        'media.created_at',
      ])
      .orderBy(`brand.${orderByField || 'id'}`, order || 'DESC');

    if (name) {
      queryBuilder.andWhere('brand.name LIKE :name', { name: `%${name}%` });
    }
    if (mediaId) {
      queryBuilder.andWhere('media.id LIKE :id', { id: `%${mediaId}%` });
    }

    return await this.paginationService.paginateEntity<Brand>(
      queryBuilder,
      page,
      per_page,
      '/api/v1/brand',
      this.configService,
    );
  }

  async findOne(id: number) {
    const brand = await this.checkBrandId({ where: { id }, relations: ['media'] })
    return handleResponseRemoveKey(brand);
  }

  async update(id: number, updateBrandDto: UpdateBrandDto, user: IUser) {
    const { name, mediaId } = updateBrandDto

    const brand = await this.checkBrandId({ where: { id } })
    if (brand.name !== name) {
      await this.checkBrandNameExist(name)
    }

    let media = undefined
    if (mediaId) {
      media = await this.checkMediaId(mediaId)
    }
    await this.brandRepository.update(id, {
      name,
      media,
      updated_by: user,
    });
    return this.findOne(id);
  }

  async remove(id: number, user: IUser) {
    await this.checkBrandId({ where: { id } })

    return this.brandRepository.update(id, {
      updated_by: user,
      deleted_by: user,
      deleted_at: new Date(),
    });
  }
}
