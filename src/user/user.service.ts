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
            .offset(offset)
            .limit(limit)
            .getMany();
    }
    public findOne(id: string) {
        return this.userRepository.findOne(id);
    }
    public counteAll() {
        return this.userRepository.findAndCount();
    }


}
