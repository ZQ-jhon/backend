import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

const CONTROLLERS = [CommentController];
@Module({
    imports: [TypeOrmModule.forFeature([Comment])],
    providers: [CommentService],
    controllers: [...CONTROLLERS],
})
export class CommentModule {}
