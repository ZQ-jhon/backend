import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    UseGuards,
    HttpException,
    HttpStatus,
    UseInterceptors,
} from '@nestjs/common';
import { Comment } from './comment.entity';
import { CommentService } from './comment.service';
import { AuthGuard } from '../auth/auth.guard';
import { of } from 'rxjs';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';
import { CommentDto } from './comment.dto';
import { v4 } from 'uuid';

@Controller('comment')
@UseGuards(AuthGuard)
@UseInterceptors(ResponseInterceptor)
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    /**
     * 构建一条 comment
     */
    @Post()
    @HttpCode(201)
    public async setComment(@Body() comment: CommentDto) {
        return await this.commentService.setComment(this.transformDTOToComment(comment)).toPromise();
    }

    /**
     * 根据 id 查询一条 comment
     */
    @Get(':id')
    public async getCommentByUserId(@Param('id') id: string) {
        const result = await this.commentService.getComment(id).toPromise();
        if (!result) {
            return of(new HttpException(`Not found ${id}`, HttpStatus.NOT_FOUND));
        }
        return result;
    }
    private transformDTOToComment(dto: CommentDto) {
        const comment = { ...new Comment(v4()), ...dto } as Comment;
        return comment;
    }
}
