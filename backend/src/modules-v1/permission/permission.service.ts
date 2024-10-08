import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}
  async createPermission(createPermissionDto: CreatePermissionDto) {
    const isExist = await this.permissionRepository.exists({
      where: { name: createPermissionDto.name },
    });
    if (isExist) {
      throw new UnprocessableEntityException('Permission đã tồn tại');
    }
    return await this.permissionRepository.save(createPermissionDto);
  }

  async findAllPermission() {
    return await this.permissionRepository.find();
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto) {
    const isExitst = await this.permissionRepository.exists({
      where: { id },
    });
    if (!isExitst) {
      throw new NotFoundException('Permission không tồn tại');
    }
    return await this.permissionRepository.update(id, updatePermissionDto);
  }

  remove(id: number) {
    return `This action removes a #${id} permission`;
  }
}
