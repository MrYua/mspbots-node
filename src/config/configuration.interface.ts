import { Options } from 'amqplib';

export interface Configuration {
  port: number;
  swagger: {
    version: string;
    title: string;
    description: string;
    path: string;
    enable: boolean;
  };
  rabbitmq: Options.Connect;
}
