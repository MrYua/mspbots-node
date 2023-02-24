import { Injectable, Logger } from '@nestjs/common';
import { connect, Connection, Channel, Options } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/config/configuration.interface';
import fs from 'fs';

@Injectable()
export class RabbitMqService {
  private logger = new Logger(RabbitMqService.name);
  private config: Configuration['rabbitmq'];
  connection: Connection;
  channel: Channel;

  constructor(private configService: ConfigService) {
    this.config = this.configService.get<Configuration['rabbitmq']>('rabbitmq');

    if (!this.config) this.logger.warn('No RabbitMQ config');
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async $connect() {
    this.connection = await connect(this.config);
    this.channel = await this.connection.createChannel();
    this.channel.assertExchange('app.node.bff', 'topic');
    this.channel.assertQueue('mspbot.node.pdf', { durable: true });

    // this.channel.consume('mspbot.node.pdf', (msg) => {
    //   console.log( JSON.parse(msg.content.toString()).data.data instanceof Array);
    //   fs.writeFileSync(
    //     'index.pdf',
    //     Buffer.from(JSON.parse(msg.content.toString()).data.data),
    //   );
    // });
  }

  async $disconnect() {
    this.connection && this.connection.close();
    this.channel && this.channel.close();
  }

  send(queue: string, content: Buffer, options?: Options.Publish) {
    this.channel.sendToQueue(queue, content, options);
  }
}
