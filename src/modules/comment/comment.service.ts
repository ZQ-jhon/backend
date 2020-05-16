import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ) {}
    public setComment(comment: Comment) {
        if (!comment.id) {
            comment.id = v4();
        }
        return from(this.commentRepository.save(comment)).pipe(
            catchError(err => of(new HttpException(`保存评论出错: ${err?.message}`, HttpStatus.SERVICE_UNAVAILABLE))),
        );
    }
    public getComment(commentId: string) {
        if (!commentId) {
            return throwError(new HttpException(`没有 commentId，无法进行精确日志查询!`, HttpStatus.PAYMENT_REQUIRED));
        }
        return from(this.commentRepository.findOne(commentId));
    }
}
