import { Body, Controller, Get, Param, Post, Query, HttpStatus, HttpException, Header, Headers } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { User } from './user.entity';
import { UserService } from './user.service';
import { errThrowerBuilder } from '../../util/err-thrower-builder';
import { AuthService } from './auth.service';
import { Success } from 'src/interfaces/success.interface';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    /**
     * 创建 User
     */
    @Post()
    @ApiCreatedResponse()
    public async save(@Body() user: User) {
        if (!user.id) { user.id = v4(); }
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
    public async getUserWithComment(@Param() param: { username: string }, @Query() query?: { offset: number, limit: number }) {
        const _user = await this.userService.getUserWithLatestComment(param.username, query).toPromise();
        return { success: true, value: _user } as Success<Partial<User>>;
    }

    @Post('login')
    @ApiCreatedResponse()
    public async login(@Body() body: { username: string, password: string }) {
        if (!body.username || !body.password) {
            return await errThrowerBuilder(new Error('More PAYMENT_REQUIRED in login'), `登录凭据不全，请补充后再尝试`, HttpStatus.PAYMENT_REQUIRED).toPromise();
        }
        const user = await this.userService.tryLogin(body).toPromise()
        if (!!user) {
            const token = this.authService.signJWT(body.username, user.id);
            return { success: true, value: token } as Success<Partial<User>>;
        }
    }

    @Get('test')
    public async test(@Headers('authorization') authHeader: string) {
        try {
            const token = await this.authService.verifyJWT(authHeader);
            return { success: true, value: token } as Success<string>;
        } catch (err) {
            return new HttpException(err.message, HttpStatus.UNAUTHORIZED);
        }
    }

}
