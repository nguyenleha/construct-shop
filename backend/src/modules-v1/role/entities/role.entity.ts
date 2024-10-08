import { User } from 'src/modules-v1/user/entities/user.entity';
import { Column, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RolePagePermissionRelation } from './rolepermissionrelation';

export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @OneToMany(
    () => RolePagePermissionRelation,
    (rolePagePermission) => rolePagePermission.role,
  )
  pagePermission: RolePagePermissionRelation[];
}
