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
        return await this.userService.save(user).toPromise();
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
            return await this.userService.findOne(query.username);
        }
        if (findByOffsetAndLimit) {
            return await this.userService.findByOffsetAndLimit(query.offset, query.limit);
        }
    }

    @Get(':username/comment')
    @ApiBearerAuth()
    public async getUserWithComment(@Param() param: { username: string }, @Query() query?: { offset: number, limit: number }) {
        return await this.userService.getUserWithLatestComment(param.username, query).toPromise();
    }

    @Post('login')
    @ApiCreatedResponse()
    public async login(@Body() body: { username: string, password: string }) {
        if (!body.username || !body.password) {
            // TODO: 抛出错误放在 service
            return errThrowerBuilder(new Error('More PAYMENT_REQUIRED in login'), `登录凭据不全，请补充后再尝试`, HttpStatus.PAYMENT_REQUIRED);
        }
        const user = await this.userService.tryLogin(body).toPromise()
        if (!!user) {
            const token = this.authService.signJWT(body.username, user.id);
            return { token };
        }
    }

    @Get('test')
    public async test(@Headers('authorization') authHeader: string) {
        try {
            const token = await this.authService.verifyJWT(authHeader);
            return {
                success: true,
                value: token,
            } as Success<string>;
        } catch (err) {
            return new HttpException(err.message, HttpStatus.UNAUTHORIZED);
        }
    }

}
