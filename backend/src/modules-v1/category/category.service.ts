import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationService } from 'src/common/utils/pagination.service';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { handleResponseRemoveKey } from 'src/common/utils/handleResponse';
import { IUser } from 'src/interfaces/common.interface';
import { GetParamsCategoryDto } from './dto/get-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
    private configService: ConfigService,
    private paginationService: PaginationService,
  ) { }

  async checkCategoryId(id: number) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      throw new UnprocessableEntityException('Category không tồn tại');
    }
    return category;
  }

  async checkCategoryNameExist(name: string) {
    const categoryName = await this.categoryRepository.exists({ where: { name } });
    if (categoryName) {
      throw new UnprocessableEntityException('Category name đã được sử dụng');
    }
  }

  async create(createCategoryDto: CreateCategoryDto, user: IUser) {
    const { name } = createCategoryDto
    await this.checkCategoryNameExist(name)
    const newCategory = await this.categoryRepository.save({
      name,
      created_by: user,
      updated_by: user
    })
    return handleResponseRemoveKey(newCategory);
  }

  async findAll(qs: GetParamsCategoryDto) {
    const { page, per_page, orderByField, order, name, status } = qs;
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .select([
        'category.id',
        'category.name',
        'category.status',
        'category.created_at',
        'category.updated_at',
      ])
      .orderBy(`category.${orderByField || 'id'}`, order || 'DESC');

    if (name) {
      queryBuilder.andWhere('category.name LIKE :name', { name: `%${name}%` });
    }
    if (status) {
      queryBuilder.andWhere('category.status LIKE :status', { status: status === 'true' ? '1' : '0' });
    }

    return await this.paginationService.paginateEntity<Category>(
      queryBuilder,
      page,
      per_page,
      '/api/v1/category',
      this.configService,
    );
  }

  async findOne(id: number) {
    const category = await this.checkCategoryId(id)
    return handleResponseRemoveKey(category);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, user: IUser) {
    const { name, status } = updateCategoryDto

    const category = await this.checkCategoryId(id)
    if (category.name !== name) {
      await this.checkCategoryNameExist(name)
    }

    await this.categoryRepository.update(id, {
      name,
      status,
      updated_by: user,
    });
    return this.findOne(id);
  }

  async remove(id: number, user: IUser) {
    await this.checkCategoryId(id)

    return this.categoryRepository.update(id, {
      updated_by: user,
      deleted_by: user,
      deleted_at: new Date(),
    });
  }
}
