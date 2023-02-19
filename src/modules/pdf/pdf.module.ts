import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { RabbitMqModule } from '@/providers/rabbitmq/rabbitmq.module';
import { PuppeteerModule } from '@/providers/puppeteer/puppeteer.module';
import { PrismaModule } from '@/providers/prisma/prisma.module';

@Module({
  imports: [RabbitMqModule.forRoot(), PuppeteerModule, PrismaModule],
  controllers: [PdfController],
  providers: [PdfService],
})
export class PdfModule {}
