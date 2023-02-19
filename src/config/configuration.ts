import { Configuration } from './configuration.interface';
import { ConfigFactory } from '@nestjs/config';

const bool = (val: string | undefined, bool: boolean): boolean =>
  val === undefined ? bool : val === 'true';
const int = (val: string | undefined, num: number): number =>
  val ? (isNaN(parseInt(val)) ? num : parseInt(val)) : num;

const configFunction: ConfigFactory<Configuration> = () => ({
  port: int(process.env.PORT, 3000),
  swagger: {
    version: process.env.SWAGGER_VERSIONS,
    title: process.env.SWAGGER_TITLE ?? 'swagger-api',
    description: process.env.SWAGGER_DESCRIPTION,
    path: process.env.SWAGGER_PATH ?? 'docs',
    enable: bool(process.env.SWAGGER_ENABLE, true),
  },
  rabbitmq: {
    hostname: process.env.RABBITMQ_HOST ?? 'localhost',
    port: int(process.env.RABBITMQ_PORT, 5672),
    username: process.env.RABBITMQ_USERNAME ?? 'guest',
    password: process.env.RABBITMQ_UPASSWORD ?? 'guest',
  },
});

export default configFunction;
