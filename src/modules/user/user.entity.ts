import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn, Unique } from 'typeorm';
import { v4 } from 'uuid';
import { Comment } from '../comment/comment.entity';

@Entity()
export class User {
    @PrimaryColumn({ name: 'id', unique: true })
    id: string = v4();
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
    @Column({ name: 'username', unique: true })
    username: string;

    @Column({ name: 'password' })
    password: string;

    // 声明子类映射，及在子类中对应的 field
    @OneToMany(
        type => Comment,
        comment => comment.userId
    )
    comment: Comment[];
}
