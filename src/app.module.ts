import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configFunction from '@/config/configuration';
import { PdfModule } from '@/modules/pdf/pdf.module';
import { HttpExceptionFilter } from '@/filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { PrismaModule } from '@/providers/prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configFunction],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    PdfModule,
    PrismaModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
