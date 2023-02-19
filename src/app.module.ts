import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configFunction from '@/config/configuration';
import { PdfModule } from '@/modules/pdf/pdf.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configFunction],
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
    }),
    PdfModule
  ],
  providers: [],
})
export class AppModule {}
