import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    public save(user: User): Promise<User> {
        return this.userRepository.save(user);
    }
    public findByOffsetAndLimit(offset = 0, limit = 10) {
        return this.userRepository
            .createQueryBuilder('user')
            .offset(offset)
            .limit(limit)
            .getMany();
    }
    public findOne(id: number) {
        return this.userRepository.findOne(id);
    }
    public counteAll() {
        return this.userRepository.findAndCount();
    }
}
