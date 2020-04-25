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
    public async save(@Body() dto: User) {
        if (!dto.id) { dto.id = v4(); }
        return await this.userService.save(dto).toPromise();
    }


    /**
     * 根据 分页参数/userId/username 查 User
     */
    @Get()
    public async getUserByQuery(@Query() query: { offset: number; limit: number; userId?: string }) {
        return await this.userService.findByOffsetAndLimit(query.userId, query.offset, query.limit).toPromise();
    }

    @Get(':id/log')
    public async getUserWithLog(@Param() param: { id: string }, @Query() query?: { offset: number, limit: number }) {
        return await this.userService.getUserWithLatestLog(param.id, query).toPromise();
    }
}
