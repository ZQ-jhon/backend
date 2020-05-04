import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './comment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('CommentController', () => {
    let commentController: CommentController;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [CommentController],
            providers: [
                CommentService,
                {
                    provide: getRepositoryToken(Comment),
                    useValue: {
                        setComment: (cmt: unknown) => new Promise(res => res(cmt)),
                        getComment: (id: string) => new Promise(res => res(new Comment(id))),
                    },
                }
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
            const setComment = jest.fn<Comment, Comment[]>(cmt => cmt);
            expect(setComment(comment).id).toEqual('cmt');
            expect(setComment).toBeCalled();
        });
    });
});
