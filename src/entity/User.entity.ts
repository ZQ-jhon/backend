import {Entity, Column, PrimaryColumn, OneToOne} from "typeorm";
import { v4 } from 'uuid'; 
import { Photo } from "./Photo.entity";
@Entity()
export class User {

    @PrimaryColumn()
    id: string = v4();

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    age: number;

    @Column('bigint') latestLogin: number = new Date().getTime();
    @OneToOne(type => Photo, photo => photo.user)
    photo: Photo;
}
