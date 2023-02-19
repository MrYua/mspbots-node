import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Configuration } from '@/config/configuration.interface';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();

  const configService = app.get(ConfigService);

  const swagger = configService.get<Configuration['swagger']>('swagger');

  const options = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .setVersion(swagger.version)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(swagger.path, app, document);

  await app.listen(configService.get<Configuration['port']>('port'), '0.0.0.0');
  const serverUrl = await app.getUrl();

  Logger.log(` 

    > Local: ${serverUrl} 
    > Api: ${serverUrl}/${swagger.path}
    
  `);
}

bootstrap();
