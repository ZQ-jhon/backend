import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Comment } from '../comment/comment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Comment])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
