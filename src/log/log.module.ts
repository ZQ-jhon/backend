import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { Log } from './log.entity';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { User } from 'src/user/user.entity';
import { LogsController } from './logs.controller';
const CONTROLLERS = [
    LogController,
    LogsController,
];
@Module({
    imports: [
        TypeOrmModule.forFeature([Log]),
    ],
    providers: [LogService],
    controllers: [...CONTROLLERS],
})
export class LogModule {}
