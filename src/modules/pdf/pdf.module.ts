import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { RabbitMqModule } from '@/providers/rabbitmq/rabbitmq.module';
import { PuppeteerModule } from '@/providers/puppeteer/puppeteer.module';

@Module({
  imports: [RabbitMqModule.forRoot(), PuppeteerModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
