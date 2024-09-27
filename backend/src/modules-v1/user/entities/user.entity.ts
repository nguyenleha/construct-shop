import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: string;

  @Column()
  address: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @CreateDateColumn()
  created_at: Date; // Ngày tạo

  @UpdateDateColumn()
  updated_at: Date; // Ngày cập nhật

  @DeleteDateColumn()
  deleted_at: Date; // Ngày xóa
}
