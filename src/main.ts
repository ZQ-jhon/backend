import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
const dep = require('../package.json');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const options = new DocumentBuilder()
        .setTitle('Typeorm + mysql + Nest.js')
        .setDescription('Just for learn')
        .setVersion(dep.version)
        .addTag('ZQ-jhon')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('docs', app, document);
    await app.listen(3000);
}
bootstrap();
