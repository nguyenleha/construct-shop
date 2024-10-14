import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { RolePagePermissionRelation } from './rolePagePermissionRelation.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'page' })
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Permission, (permission) => permission.pages)
  @JoinTable({
    name: 'page_permission_relation',
    joinColumn: { name: 'page_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: Permission[];

  // Many-to-Many với Role
  @OneToMany(
    () => RolePagePermissionRelation,
    (rolePagePermission) => rolePagePermission.role,
  )
  rolePage: RolePagePermissionRelation[];
}
