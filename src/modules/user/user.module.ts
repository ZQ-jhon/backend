import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Comment } from '../comment/comment.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User, Comment]), JwtModule.register({ secret: 'hello' })],
    providers: [UserService, AuthService],
    controllers: [UserController],
})
export class UserModule {}
