import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from './role.entity';
import { Permission } from 'src/modules-v1/permission/entities/permission.entity';

@Entity('role_page_permission_relation')
export class RolePagePermissionRelation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Role, (role) => role.pagePermission)
  role: Role;

//   @ManyToOne(() => Page, (page) => page.rolePage)
//   page: Page;

  @ManyToOne(() => Permission, (permission) => permission.rolePermission)
  permission: Permission;
}
