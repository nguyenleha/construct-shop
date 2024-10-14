import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '../entities/permission.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from '../dto/create-role.dto';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdatePermissionDto } from '../dto/update-role.dto';

export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async findAllPermission() {
    return await this.permissionRepository.find();
  }

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const isExist = await this.permissionRepository.exist({
      where: { name: createPermissionDto.name },
    });
    if (isExist) {
      throw new UnprocessableEntityException('Permission đã tồn tại');
    }
    return await this.permissionRepository.save(createPermissionDto);
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
    const isExist = await this.permissionRepository.exist({ where: { id } });
    if (!isExist) {
      throw new NotFoundException('Permission không tồn tại');
    }
    return await this.permissionRepository.update(id, updatePermissionDto);
  }

  
}
