import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwError, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>
    ) {}
    public setComment(comment: Comment) {
        return from(this.commentRepository.save(comment)).pipe(
            catchError(err => throwError(new InternalServerErrorException(`保存评论出错: ${err?.message}`)))
        );
    }
    public getComment(commentId: string) {
        if (!commentId) {
            return throwError(new HttpException(`没有 commentId，无法进行精确日志查询!`, HttpStatus.PAYMENT_REQUIRED));
        }
        return from(this.commentRepository.findOne(commentId));
    }
}
