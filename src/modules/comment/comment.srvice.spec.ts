import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';

describe('CommentService', () => {
    let commentService: CommentService;
    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            providers: [
                CommentService,
                {
                    provide: getRepositoryToken(Comment),
                    useValue: {
                        save: (cmt: unknown) => new Promise(res => res(cmt)),
                        findOne: (id: string) => new Promise(res => res(new Comment(id))),
                    },
                }
            ],
            controllers: [CommentController],
        }).compile();
        commentService = app.get(CommentService);
    });

    it('CommentService has been defined', async () => {
        expect(commentService).toBeDefined();
        const cmt = new Comment('cmt');
        expect(await commentService.setComment(cmt).toPromise()).toBeTruthy();
        const result = await commentService.getComment(cmt.id).toPromise();
        expect(result).toBeTruthy();
    });
});
