import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Page } from './page.entity';
import { Permission } from './permission.entity';

@Entity({ name: 'role' })
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  isDeleted: boolean;

  @Column()
  deleted_at: Date;

  @ManyToMany(() => Page)
  @JoinTable({
    name: 'roles_pages', // Tên của bảng trung gian
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'page_id', referencedColumnName: 'id' },
  })
  pages: Page[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'roles_permission', // Tên của bảng trung gian
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permission: Permission[];

  
}
