import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  address: string;

  @Column()
  image: string;

  @Column()
  refreshToken: string;

  @Column()
  isActive: boolean;

  @Column()
  created_at: Date;

  @Column()
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' }) // Đặt tên cho cột khóa ngoại
  created_by: User; // Tham chiếu tới người tạo ra user này

  @Column()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @Column()
  isDeleted: boolean;

  @Column()
  deleted_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;

  // Mối quan hệ nhiều-nhiều với bảng Role
  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles', // Tên của bảng trung gian
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];
}
