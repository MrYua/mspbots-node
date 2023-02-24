import { Injectable } from '@nestjs/common';
import { RabbitMqService } from '@/providers/rabbitmq/rabbitmq.service';
import { PuppeteerService } from '@/providers/puppeteer/puppeteer.service';
import { PrismaService } from '@/providers/prisma/prisma.service';
import { safeUrl } from '@/helpers/safe-url';
import { parseUrl } from '@/helpers/parse-url';
import { merge } from 'lodash';
import { CreatePdfDto } from './pdf.dto';

@Injectable()
export class PdfService {
  constructor(
    private puppeteer: PuppeteerService,
    private amq: RabbitMqService,
    private prisma: PrismaService,
  ) {}

  async createPdf(userId: string, data: CreatePdfDto) {
    const { url } = data;
    const urlSafe = safeUrl(url);
    const query = parseUrl(url);

    const result = await this.prisma.pdf.create({
      data: { url, urlSafe, userId, attributes: JSON.stringify(data) },
    });

    this.puppeteer.render(url, {
      ...merge(data, query),
      resolve: async (file) => {
        this.amq.send(
          'mspbot.node.pdf',
          Buffer.from(
            JSON.stringify({
              statusCode: 200,
              file,
              data: result,
            }),
          ),
        );
        await this.prisma.pdf.update({
          where: { id: result.id },
          data: { isVerified: true },
        });
      },

      reject: async (error) => {
        this.amq.send(
          'mspbot.node.pdf',
          Buffer.from(JSON.stringify({ ...error.response, data: result })),
        );
      },
    });

    return result;
  }
}
