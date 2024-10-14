import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RolePagePermissionRelation } from './rolePagePermissionRelation.entity';
import { Page } from './page.entity';

@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Page, (page) => page.permissions)
  pages: Page[];

  @OneToMany(
    () => RolePagePermissionRelation,
    (rolePagePermission) => rolePagePermission.role,
  )
  rolePermission: RolePagePermissionRelation[];
}
