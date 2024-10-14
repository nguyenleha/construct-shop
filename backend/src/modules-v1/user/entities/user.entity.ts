import { Role } from 'src/modules-v1/roles/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
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

  @Column({ type: 'text', nullable: true })
  refreshToken: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  created_by: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  updated_by: User;

  @ManyToOne(() => User, (user) => user.id, { nullable: true })
  @JoinColumn()
  deleted_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({
    name: 'user_role_relation',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
