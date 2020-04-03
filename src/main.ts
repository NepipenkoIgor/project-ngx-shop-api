import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { INestApplication } from '@nestjs/common';

// tslint:disable-next-line:typedef
async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('Ngx-shop-API')
    .setDescription('JsDaddy ngx-shop-api')
    .setVersion('1.0')
    .addTag('shop')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  const configService: ConfigService = app.get(ConfigService);
  const port: string = configService.get('PORT') as string;
  await app.listen(process.env.PORT || port);
}
bootstrap();
