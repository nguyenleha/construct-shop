import { User } from 'src/modules-v1/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'media' })
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  created_by: User;

  @CreateDateColumn()
  created_at: Date; // Ngày tạo
}
