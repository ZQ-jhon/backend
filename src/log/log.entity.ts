import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id?: number;

    @CreateDateColumn()
    commentedAt: Date;

    @Column()
    content: string;

    // 声明父类映射，及在子父类中对应的 field
    @OneToOne(type => User, user => user.log)
    @JoinColumn()
    userId: number;
}
