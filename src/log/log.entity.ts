import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Log {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('timestamp')
    commentedAt: number = new Date().getTime();

    @Column()
    content: string;

    // 声明父类映射，及在子类中对应的 field
    @OneToOne(type => User, user => user.log)
    @JoinColumn()
    user: User;
}
