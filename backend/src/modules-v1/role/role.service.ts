import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  @InjectRepository(Role)
  private readonly roleRepository: Repository<Role>;
  async createRole(createRoleDto: CreateRoleDto) {
    const { name, permissionIds } = createRoleDto;
    if (await this.roleRepository.exists({ where: { name } })) {
      throw new UnprocessableEntityException('Role đã tồn tại');
    }
    return 'This action adds a new role';
  }

  findAll() {
    return `This action returns all role`;
  }

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
