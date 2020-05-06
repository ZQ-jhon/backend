import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { Comment } from './comment.entity';
import { of } from 'rxjs';

describe('CommentController', () => {
    let commentController: CommentController;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [
                {
                    provide: 'CommentService',
                    useValue: {
                        setComment: (cmt: unknown) => of(cmt),
                        getComment: (id: string) => of(new Comment(id)),
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
        });
    });
});
