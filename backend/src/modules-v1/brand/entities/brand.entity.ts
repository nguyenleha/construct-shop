import { Media } from "src/modules-v1/media/entities/media.entity";
import { User } from "src/modules-v1/user/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

@Entity({ name: 'brand' })
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;

    @ManyToOne(() => Media, (media) => media.id, { nullable: true })
    @JoinColumn()
    media: Media;

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
}
