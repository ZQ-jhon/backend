import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';

const CONTROLLERS = [CommentController];
@Module({
    imports: [TypeOrmModule.forFeature([Comment, User])],
    providers: [CommentService, UserService],
    controllers: [...CONTROLLERS],
})
export class CommentModule {}
