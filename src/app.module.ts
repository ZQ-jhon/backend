import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CommentModule } from './modules/comment/comment.module';
import { UserModule } from './modules/user/user.module';
import { LogModule } from './modules/log/log.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { DatabaseModule } from './modules/database/database.module';
import { RedisCacheModule } from './modules/redis-cache/redis-cache.module';

@Module({
    imports: [LogModule, AuthModule, UserModule, CommentModule, DatabaseModule, RedisCacheModule],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    exports: [AuthModule, RedisCacheModule],
})
export class AppModule {}
