import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { logger } from '../../middleware/logger.middleware';
import { User } from '../user/user.entity';
import { RedisCacheModule } from '../redis-cache/redis-cache.module';

@Module({
    imports: [TypeOrmModule.forFeature([Log, User]), RedisCacheModule],
    providers: [LogService],
    controllers: [LogController],
    exports: [LogService, TypeOrmModule.forFeature([Log])],
})
export class LogModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(logger).forRoutes(LogController);
    }
}
