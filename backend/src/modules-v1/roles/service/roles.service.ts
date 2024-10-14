import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { Page } from '../entities/page.entity';
import { Permission } from '../entities/permission.entity';
import { RolePagePermissionRelation } from '../entities/rolePagePermissionRelation.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePagePermissionRelation)
    private readonly pagePermissionRepository: Repository<RolePagePermissionRelation>,
  ) {}
  /**
   * =========== Role ===========
   */

  async findAllRole() {
    return await this.roleRepository.find({
      relations: ['pagePermission.page', 'pagePermission.permission'],
    });
  }

  async checkPagePermission(pageIds: number[], permissionIds: number[][]) {
    if (pageIds.length !== permissionIds.length) {
      throw new UnprocessableEntityException('Permission với Page khác nhau');
    }
    await Promise.all(
      pageIds.map(async (pageId, index) => {
        const page = await this.pageRepository.findOne({
          where: { id: pageId },
          relations: ['permissions'],
        });
        if (!page) {
          throw new NotFoundException('Page không tìm thấy');
        }
        if (
          !page.permissions.some((permission) =>
            permissionIds[index].includes(permission.id),
          )
        ) {
          throw new NotFoundException('Permission không tìm thấy trong Page');
        }
      }),
    );
  }

  async findRoleById(where: { id: number } | { name: string }) {
    return await this.roleRepository.findOne({
      where,
      relations: ['pagePermission.page', 'pagePermission.permission'],
    });
  }
  async createRole(createRoleDto: CreateRoleDto) {
    const { name, pageIds, permissionIds } = createRoleDto;

    if (await this.roleRepository.exist({ where: { name } })) {
      throw new UnprocessableEntityException('Role đã tồn tại');
    }
    await this.checkPagePermission(pageIds, permissionIds);

    // Sử dụng transaction thông qua EntityManager
    await this.roleRepository.manager.transaction(async (manager) => {
      const role = await manager.save(Role, { name }); // Lưu role mới
      const pages = await manager.findByIds(Page, pageIds); // Tìm các page

      // Tìm tất cả permissions một lần
      const results = await Promise.all(
        permissionIds.map(async (ids, index) => {
          const permissions = await manager.findByIds(Permission, ids);
          return { index, page: pages[index], permissions };
        }),
      );

      // Tạo mảng các mối quan hệ Role - Page - Permission
      const pagePermissionEntities = results.flatMap((result) => {
        return result.permissions.map((permission) => ({
          role,
          page: result.page,
          permission,
        }));
      });

      // Lưu các mối quan hệ Role - Page - Permission
      if (pagePermissionEntities.length > 0) {
        await manager.save(RolePagePermissionRelation, pagePermissionEntities);
      }
    });

    return await this.findRoleById({ name });
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto) {
    const { name, pageIds, permissionIds } = updateRoleDto;

    const role = await this.roleRepository.findOne({ where: { id } });
    if (!role) {
      throw new NotFoundException('Role không tồn tại');
    }

    // Kiểm tra trùng tên role
    if (name && name !== role.name) {
      if (await this.roleRepository.exist({ where: { name } })) {
        throw new UnprocessableEntityException('Role đã tồn tại với tên này');
      }
      role.name = name;
    }
    await this.checkPagePermission(pageIds, permissionIds);

    // Sử dụng transaction thông qua EntityManager
    await this.pagePermissionRepository.manager.transaction(async (manager) => {
      // Tìm tất cả page và permission một lần
      const pages = await this.pageRepository.findByIds(pageIds);
      const permissionsByPage = await Promise.all(
        pageIds.map((_, index) =>
          this.permissionRepository.findByIds(permissionIds[index] || []),
        ),
      );
      // Xóa một quan hệ Role - Page - Permission
      await manager.delete(RolePagePermissionRelation, { role });

      const pagePermissionEntities = [];
      for (let i = 0; i < pages.length; i++) {
        for (const permission of permissionsByPage[i]) {
          pagePermissionEntities.push({
            role,
            page: pages[i],
            permission,
          });
        }
      }

      // Thêm mới các mối quan hệ Role - Page - Permission
      if (pagePermissionEntities.length > 0) {
        await manager.save(RolePagePermissionRelation, pagePermissionEntities);
      }
      await manager.save(role);
    });

    return this.findRoleById({ id: role.id });
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}
