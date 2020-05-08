import { Body, Controller, Get, Headers, HttpStatus, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { Success } from '../../interfaces/success.interface';
import { errThrowerBuilder } from '../../util/err-thrower-builder';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    /**
     * 创建 User
     */
    @Post()
    @ApiCreatedResponse()
    public async save(@Body() user: User) {
        if (!user.id) {
            user.id = v4();
        }
        const _user = await this.userService.save(user).toPromise();
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
            const _user = await this.userService.findOne(query.username).toPromise();
            return { success: true, value: _user } as Success<Partial<User>>;
        }
        if (findByOffsetAndLimit) {
            const _users = await this.userService.findByOffsetAndLimit(query.offset, query.limit).toPromise();
            return { succes: true, value: _users };
        }
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

    @Post('login')
    @ApiCreatedResponse()
    public async login(@Body() body: { username: string; password: string }) {
        if (!body.username || !body.password) {
            return await errThrowerBuilder(
                new Error('More PAYMENT_REQUIRED in login'),
                `登录凭据不全，请补充后再尝试`,
                HttpStatus.PAYMENT_REQUIRED
            ).toPromise();
        }
        const user = await this.userService.tryLogin(body).toPromise();
        if (!!user) {
            const token = this.authService.signJWT(body.username, user.id);
            return { success: true, value: token } as Success<Partial<User>>;
        }
    }

    @Post('token')
    @ApiBearerAuth()
    public refreshToken(@Headers('authorization') authorization: string) {
        return { success: true, value: this.authService.refreshToken(authorization.split(' ')[1]) };
    }
}
