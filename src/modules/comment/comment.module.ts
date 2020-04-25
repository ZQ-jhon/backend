import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommmentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';

const CONTROLLERS = [
    CommmentController,
];
@Module({
    imports: [
        TypeOrmModule.forFeature([Comment]),
    ],
    providers: [CommentService],
    controllers: [...CONTROLLERS],
})
export class CommentModule { }
