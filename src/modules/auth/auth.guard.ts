import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { Repository } from 'typeorm';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly redisCacheService: RedisCacheService,
    ) {}

    async canActivate(context: ExecutionContext) {
        try {
            const authorization = context.switchToHttp().getRequest<{ headers: { authorization: string } }>().headers?.authorization;
            if (!authorization) {
                throw new Error('Need authorization field in http headers.')
            }
            const id = await this.redisCacheService.get(authorization.split(' ').pop()).toPromise();
            if (isNil(id)) {
                throw new Error('Detected token is not exist in redis, maybe expire. try again with new!');
            }
            if (isNil(id)) {
                throw new Error('Id is invalid, check token and request again!');
            }
            const user = await this.userRepository.findOne(id);
            if (isNil(user)) {
                throw new Error('Token invalid, the user is not exist.');
            }
            return !!user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
