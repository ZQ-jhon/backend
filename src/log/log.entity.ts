import { Entity, Column, OneToOne, JoinColumn, CreateDateColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/user.entity';
import { v4 } from 'uuid';
@Entity()
export class Log {
    @PrimaryColumn()
    id?: string = v4();

    @CreateDateColumn()
    commentedAt: Date;

    @Column()
    content: string;

    // 声明父类映射，及在子父类中对应的 field
    @ManyToOne(type => User, user => user.log)
    @JoinColumn()
    user: string;
}
