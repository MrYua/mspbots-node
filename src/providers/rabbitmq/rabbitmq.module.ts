import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMqService } from './rabbitmq.service';

@Module({
  imports: [ConfigModule],
  providers: [RabbitMqService],
  exports: [RabbitMqService],
})
export class RabbitMqModule {
  static forRoot() {
    return {
      module: ConfigModule,
      providers:[RabbitMqService],
      exports: [RabbitMqService],
    };
  }
}
