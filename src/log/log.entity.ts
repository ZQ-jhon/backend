import { User } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { v4 } from 'uuid';
@Entity()
export class Log {
    @PrimaryColumn()
    id: string = v4();

    @CreateDateColumn({ name: 'commented_at' })
    commentedAt: Date;

    @Column()
    content: string;

    // 声明父类映射，及在子父类中对应的 field
    @ManyToOne(type => User, user => user.log)
    @JoinColumn({ name: 'user_id' })
    userId: User;
}
