import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'file' })
export class File {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
}
