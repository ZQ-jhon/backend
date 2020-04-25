import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
import { User } from '../user/user.entity';
@Entity()
export class Comment {
    @PrimaryColumn({ unique: true })
    id: string = v4();

    @CreateDateColumn({ name: 'commented_at' })
    commentedAt: Date;

    @Column()
    content: string;

    // 声明父类映射，及在子父类中对应的 field
    @ManyToOne(type => User, user => user.comment)
    @JoinColumn({ name: 'user_id' })
    userId: User;
}
