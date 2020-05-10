import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '../../auth.guard';
import { Success } from '../../interfaces/success.interface';
import { UserDtoPipe } from './user-dto-pipe.pipe';
import { UserDto } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) { }

    /**
     * 创建 User
     */
    @Post()
    @ApiCreatedResponse()
    public async save(@Body(new UserDtoPipe()) user: UserDto) {
        const _user = await this.userService.save(plainToClass(User, user)).toPromise();
        return { success: true, value: _user } as Success<Partial<User>>;
    }

    /**
     * 根据 分页参数/userId/username 查 User
     */
    @Get()
    @ApiBearerAuth()
    public async getUserByQuery(@Query() query: { offset: number; limit: number; userId?: string; username?: string }) {
        const findByUserIdOrUsername = !!query.userId || !!query.username;
        const findByOffsetAndLimit = !!query.offset || !!query.limit;
        if (findByUserIdOrUsername) {
            console.log(findByUserIdOrUsername);
            const _user = await this.userService.findOne(query.username).toPromise();
            return { success: true, value: _user } as Success<Partial<User>>;
        }
        if (findByOffsetAndLimit) {
            console.log(findByOffsetAndLimit);
            const _users = await this.userService.findByOffsetAndLimit(query.offset, query.limit).toPromise();
            return { succes: true, value: _users };
        }
    }

    @Get('/:id')
    public async getUserByUserId(@Param('id') userId: string) {
        return this.userService.findOne(userId);
    }

    @Get(':username/comment')
    @ApiBearerAuth()
    public async getUserWithComment(
        @Param('username') username: string,
        @Query('offset') offset: number,
        @Query('limit') limit: number
    ) {
        const _user = await this.userService.getUserWithLatestComment(username, offset, limit).toPromise();
        return { success: true, value: _user } as Success<Partial<User>>;
    }
}
