import { Options } from 'amqplib';

export interface Configuration {
  swagger: {
    version: string;
    title: string;
    description: string;
    path: string;
    enable: boolean;
  };
  rabbitmq: Options.Connect;
}
