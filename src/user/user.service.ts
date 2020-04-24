import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { User } from './user.entity';
@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    public save(user: User): Promise<User> {
        if (!user.id) { user.id = v4(); }
        return this.userRepository.save(user);
    }
    public findByOffsetAndLimit(offset = 0, limit = 10) {
        return this.userRepository
            .createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .offset(offset)
            .limit(limit)
            .getMany();
    }
    public findOne(id: string) {
        return this.userRepository
            .createQueryBuilder('user')
            .select(['user.username', 'user.id', 'user.createdAt'])
            .where(`user.id = :id OR user.username = :id`, { id })
            .getMany();
    }
    public countAllUser() {
        return this.userRepository.findAndCount();
    }

}
