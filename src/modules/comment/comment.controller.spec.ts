import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { of, throwError } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { verifyAuthHeader } from '../../util/verify-auth-headers';
import { isNil } from 'lodash';
describe('CommentController', () => {
    let commentController: CommentController;
    const authGuard = async (context: ExecutionContext) => {
        try {
            const authorization = context.switchToHttp().getRequest().headers.authorization as string;
            const id = verifyAuthHeader(authorization);
            if (isNil(id)) {
                throw new Error('Id is invalid, check token and request again!');
            }
            const user = await this.userService.findOne(id).toPromise();
            if (isNil(user)) {
                throw new Error('Token invalid, the user is not exist.');
            }
            return !!user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    };
    beforeEach(async () => {
        const commentsCache = [] as Comment[];
        const app: TestingModule = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [
                {
                    provide: 'CommentService',
                    useValue: {
                        setComment: (cmt: Comment) => {
                            commentsCache.push(new Comment(cmt.id));
                            return of(cmt);
                        },
                        getComment: (id: string) => {
                            const index = commentsCache.findIndex(c => c.id === id);
                            if (index >= 0) {
                                return of(commentsCache[index]);
                            } else {
                                return throwError(new Error(`${id} is not exist!`));
                            }
                        },
                    },
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(authGuard)
            .compile();
        commentController = app.get<CommentController>(CommentController);
    });

    describe('Begin CommentController Test', () => {
        it('Controller & Service Defined', () => {
            expect(commentController).toBeDefined();
            expect(commentController.getCommentByUserId).toBeDefined();
            expect(commentController.setComment).toBeDefined();
        });
        it('Called CommentService after called CommentController', async () => {
            const comment = new Comment('cmt');
            expect(await commentController.setComment(comment)).toBeTruthy();
            expect(await commentController.getCommentByUserId('cmt')).toEqual(comment);
            await commentController
                .getCommentByUserId('unExist userId')
                .catch(err => expect(err.message).toEqual(`unExist userId is not exist!`));
        });
    });
});
