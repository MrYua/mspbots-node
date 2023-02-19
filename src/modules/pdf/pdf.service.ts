import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '@/providers/rabbitmq/rabbitmq.service';
import { PuppeteerService } from '@/providers/puppeteer/puppeteer.service';

@Injectable()
export class PdfService {
  constructor(private amqp: RabbitMqService) {}

  async createPdf() {
    this.amqp.send('mspbot.node.pdf', '222');
  }
}
