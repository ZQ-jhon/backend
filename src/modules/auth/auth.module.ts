import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWT_SECRET } from '../../constants/jwt-secret';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({ secret: JWT_SECRET }), RedisCacheModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
