import { Body, Controller, Get, HttpCode, Param, Post, UseGuards } from '@nestjs/common';
import { Success } from '../../interfaces/success.interface';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { errThrowerBuilder } from '../../util/err-thrower-builder';
import { AuthGuard } from '../../auth.guard';
@Controller('comment')
@UseGuards(AuthGuard)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    /**
     * 构建一条 comment
     */
    @Post()
    @HttpCode(201)
    public async setComment(@Body() comment: Comment) {
        const result = await this.commentService.setComment(comment).toPromise();
        return { success: true, value: result } as Success<Comment>;
    }

    /**
     * 根据 id 查询一条 comment
     */
    @Get(':id')
    public async getCommentByUserId(@Param('id') id: string) {
        const result = await this.commentService.getComment(id).toPromise();
        if (!result) {
            return errThrowerBuilder(new Error('没有查询到结果'), `没有查询到结果 ${id}`, 404);
        }
        return { success: true, value: result } as Success<Comment>;
    }
}
