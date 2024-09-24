import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'page' })
export class Page {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isDelete: boolean;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date | null;
}
