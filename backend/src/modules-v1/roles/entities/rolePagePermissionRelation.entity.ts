import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { Page } from './page.entity';
import { Permission } from './permission.entity';

@Entity('role_page_permission_relation')
export class RolePagePermissionRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.pagePermission)
  role: Role;

  @ManyToOne(() => Page, (page) => page.rolePage)
  page: Page;

  @ManyToOne(() => Permission, (permission) => permission.rolePermission)
  permission: Permission;
}
