import { InjectRepository } from '@nestjs/typeorm';
import { Page } from '../entities/page.entity';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePageDto } from '../dto/create-role.dto';
import {
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdatePageDto } from '../dto/update-role.dto';

export class PageService {
  constructor(
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async checkPermissionId(ids: number[]) {
    const permission = await this.permissionRepository.findByIds(ids);
    await Promise.all(
      ids.map(async (id) => {
        if (!permission.find((permission) => permission.id === id)) {
          throw new NotFoundException("Permission id:'${id}' không tìm thấy");
        }
      }),
    );
    return permission;
  }

  async findAllPage() {
    return await this.pageRepository.find();
  }
  async createPage(createPageDto: CreatePageDto) {
    const { name, permissionIds } = createPageDto;

    const isExist = await this.pageRepository.exists({ where: { name: name } });

    if (isExist) {
      throw new UnauthorizedException('Page đã tồn tại');
    }
    const permissions = await this.checkPermissionId(permissionIds);
    return await this.pageRepository.save({ name, permissions });
  }

  async updatePage(id: number, updatePageDto: UpdatePageDto) {
    const { name, permissionIds } = updatePageDto;
    const isExist = await this.pageRepository.exist({ where: { id } });
    if (!isExist) {
      throw new NotFoundException('Page không tồn tại');
    }
    const currentPage = await this.pageRepository.findOne({ where: { id } });

    // Kiểm tra tên đã tồn tại
    const existingPage = await this.pageRepository.findOne({ where: { name } });

    // Nếu tên đã tồn tại và khác với tên của Page hiện tại, giữ nguyên tên cũ
    const newName =
      existingPage && existingPage.id !== id ? currentPage.name : name;

    // Kiểm tra và lấy permissions
    const permissions = await this.checkPermissionId(permissionIds);

    // Cập nhật và lưu Page
    return await this.pageRepository.save({ id, name: newName, permissions });
  }
}
