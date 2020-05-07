import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { of, throwError } from 'rxjs';
describe('CommentController', () => {
    let commentController: CommentController;
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
        }).compile();
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
            expect(await commentController.getCommentByUserId('cmt')).toEqual({ success: true, value: comment });
            await commentController
                .getCommentByUserId('unExist userId')
                .catch(err => expect(err.message).toEqual(`unExist userId is not exist!`));
        });
    });
});
