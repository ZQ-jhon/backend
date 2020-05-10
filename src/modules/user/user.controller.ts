import { Controller, Get, HttpException, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { isNullOrUndefined } from 'util';
import { AuthGuard } from '../../auth.guard';
import { Success } from '../../interfaces/success.interface';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
    constructor(private readonly userService: UserService) {}

    /**
     * 根据 分页参数/userId/username 查 User
     */
    @Get()
    @ApiBearerAuth()
    public async getUserByQuery(@Query() query: { offset: number; limit: number }) {
        if (isNullOrUndefined(query.offset) || isNullOrUndefined(query.limit)) {
            throw new HttpException(`Need more query or parameter`, HttpStatus.BAD_REQUEST);
        }
        const _users = await this.userService.findByOffsetAndLimit(query.offset, query.limit).toPromise();
        return { success: true, value: _users };
    }

    @Get('/:userIdOrName')
    public async getUserByUserId(@Param('userIdOrName') userIdOrName: string) {
        const user = await this.userService.findOne(userIdOrName).toPromise();
        return { success: true, value: user };
    }

    @Get(':userId/comment')
    @ApiBearerAuth()
    public async getUserWithComment(
        @Param('userId') userId: string,
        @Query('offset') offset: number,
        @Query('limit') limit: number
    ) {
        const _user = await this.userService.getUserWithLatestComment(userId, offset, limit).toPromise();
        return { success: true, value: _user } as Success<Partial<User>>;
    }
}
