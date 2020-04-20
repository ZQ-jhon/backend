import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { LogController } from './log.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Log])],
    providers: [LogService],
    controllers: [LogController],
})
export class LogModule {}
