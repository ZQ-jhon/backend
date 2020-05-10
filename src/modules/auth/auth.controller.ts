import { Controller, Post, Body, HttpStatus, Headers } from '@nestjs/common';
import { ApiCreatedResponse, ApiBearerAuth } from '@nestjs/swagger';
import { errThrowerBuilder } from '../../util/err-thrower-builder';
import { Success } from '../../interfaces/success.interface';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}
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
        const user = await this.authService.tryLogin(body).toPromise();
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
