import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }

    /**
     * 创建 User
     */
    @Post()
    @ApiCreatedResponse()
    public async save(@Body() user: User) {
        if (!user.id) { user.id = v4(); }
        return await this.userService.save(user).toPromise();
    }


    /**
     * 根据 分页参数/userId/username 查 User
     */
    @Get()
    public async getUserByQuery(@Query() query: { offset: number; limit: number; userId?: string; username?: string }) {
        const findByUserIdOrUsername = !!query.userId || !!query.username;
        const findByOffsetAndLimit = !!query.offset || !!query.limit;
        if (findByUserIdOrUsername) {
            return await this.userService.findOne(query.username);
        }
        if (findByOffsetAndLimit) {
            return await this.userService.findByOffsetAndLimit(query.offset, query.limit);
        }
    }

    @Get(':id/comment')
    public async getUserWithComment(@Param() param: { id: string }, @Query() query?: { offset: number, limit: number }) {
        return await this.userService.getUserWithLatestComment(param.id, query).toPromise();
    }
}
