import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogController } from './log.controller';
import { Log } from './log.entity';
import { LogService } from './log.service';
const CONTROLLERS = [
    LogController,
];
@Module({
    imports: [
        TypeOrmModule.forFeature([Log]),
    ],
    providers: [LogService],
    controllers: [...CONTROLLERS],
})
export class LogModule { }
