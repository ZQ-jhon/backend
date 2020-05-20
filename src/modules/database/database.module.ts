import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: '1234',
            database: 'test',
            entities: ['dist/**/**.entity{.ts,.js}'], // sb webpack
            synchronize: true,
        }),
    ],
})
export class DatabaseModule {}
