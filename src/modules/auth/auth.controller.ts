import { Controller, Post, Body, HttpStatus, Headers, HttpException, UseInterceptors } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { UserDtoPipe } from '../user/user-dto-pipe.pipe';
import { UserDto } from '../user/user.dto';
import { plainToClass } from 'class-transformer';
import { of } from 'rxjs/internal/observable/of';
import { ResponseInterceptor } from '../../interceptors/response.interceptor';

@Controller('auth')
@UseInterceptors(ResponseInterceptor)
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Post('login')
    @ApiCreatedResponse()
    public async login(@Body() body: { username: string; password: string }) {
        if (!body.username || !body.password) {
            return await of(
                new HttpException('More PAYMENT_REQUIRED in login process.', HttpStatus.PAYMENT_REQUIRED)
            ).toPromise();
        }
        const user = (await this.authService.login(body).toPromise()) as User;
        if (!!user) {
            const token = this.authService.signJWT(body.username, user.id);
            return token;
        }
    }
    @Post('token')
    @ApiBearerAuth('Bearer')
    public refreshToken(@Headers('authorization') authorization: string) {
        return this.authService.refreshToken(authorization.split(' ').pop());
    }

    /**
     * 创建 User
     */
    @Post('user')
    @ApiCreatedResponse()
    public async create(@Body(new UserDtoPipe()) userDTO: UserDto) {
        const user = await this.authService.createUser(userDTO).toPromise();
        return user;
    }
}
