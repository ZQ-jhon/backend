import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';
import { Log } from '../log/log.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Log])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
