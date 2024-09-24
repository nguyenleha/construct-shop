import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Repository } from 'typeorm';
import { Page } from 'entities/page.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}
  async create(createPageDto: CreatePageDto) {
    const page = await this.pageRepository.save(createPageDto);
    return {
      name: page.name,
    };
  }

  async findAll(): Promise<{ pages: CreatePageDto[] }> {
    const page = await this.pageRepository.find();
    if (!page) {
      throw new NotFoundException('Trang không tồn tại');
    }
    const renderPage = (e: Page): CreatePageDto => {
      const { name } = e;
      return {
        name,
      };
    };
    const result = page.map(renderPage);
    return { pages: result };
  }

  findOne(id: number) {
    return `This action returns a #${id} page`;
  }

  update(id: number, updatePageDto: UpdatePageDto) {
    return `This action updates a #${id} page`;
  }

  remove(id: number) {
    return `This action removes a #${id} page`;
  }
}
