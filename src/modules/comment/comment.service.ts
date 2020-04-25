import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of, throwError } from 'rxjs';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Comment } from './comment.entity';
import { makeObservable } from '../../util/make-observable';
import { catchError } from 'rxjs/operators';
import { errThrowerBuilder } from '../../util/err-thrower-builder';


@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
    ) { }
    public setComment(comment: Comment) {
        if (!comment.id) { comment.id = v4(); }
        return makeObservable(this.commentRepository.save(comment)).pipe(
            catchError(err => errThrowerBuilder(err, '保存评论出错', HttpStatus.SERVICE_UNAVAILABLE))
        );
    }
    public getComment(commentId: string) {
        if (!commentId) {
            return throwError(new HttpException(`没有 commentId，无法进行精确日志查询!`, HttpStatus.PAYMENT_REQUIRED));
        }
        return makeObservable(this.commentRepository.findOne(commentId));
    }
}
