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

@Entity({ name: 'user' })
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
}
