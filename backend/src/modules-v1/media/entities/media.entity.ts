import { User } from 'src/modules-v1/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  created_by: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  updated_by: User;

  @CreateDateColumn()
  created_at: Date; // Ngày tạo

  @UpdateDateColumn()
  updated_at: Date; // Ngày cập nhật
}
