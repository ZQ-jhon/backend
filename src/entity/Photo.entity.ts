import {Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import { User } from "./User.entity";
import { v4 } from 'uuid'; 

@Entity()
export class Photo {

    @PrimaryColumn()
    id: string = v4();
    @Column('bigint')
    createdAt: number = new Date().getTime();

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    filename: string;

    @Column()
    views: number;

    @Column()
    isPublished: boolean;

    @OneToOne(type => User, user => user.photo)
    @JoinColumn()
    user: User;
}