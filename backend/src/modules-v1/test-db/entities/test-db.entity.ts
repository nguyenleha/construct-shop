import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'testDb' })
export class TestDb {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
