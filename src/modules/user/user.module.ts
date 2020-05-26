import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from '../comment/comment.entity';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([User, Comment]), RedisCacheModule],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
