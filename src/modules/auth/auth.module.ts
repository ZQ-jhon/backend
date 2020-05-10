import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({ secret: 'hello' })],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
