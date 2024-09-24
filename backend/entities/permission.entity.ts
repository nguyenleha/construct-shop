import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Page } from './page.entity';

@Entity({ name: 'permission' })
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isDeleted: boolean;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;

  @ManyToMany(() => Page)
  @JoinTable({
    name: 'permission_page', // Tên của bảng trung gian
    joinColumn: { name: 'permission_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'page_id', referencedColumnName: 'id' },
  })
  page: Page[];
}
