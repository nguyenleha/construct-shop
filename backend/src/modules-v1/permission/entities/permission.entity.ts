import { RolePagePermissionRelation } from 'src/modules-v1/role/entities/rolepermissionrelation';
import { Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(
    () => RolePagePermissionRelation,
    (rolePagePermission) => rolePagePermission.role,
  )
  rolePermission: RolePagePermissionRelation[];
}
