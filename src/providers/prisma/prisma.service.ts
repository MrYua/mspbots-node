import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pdf, PrismaClient } from '@prisma/client';
import { Expose } from './prisma.interface';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  expose<T>(item: T): Expose<T> {
    if (!item) return {} as T;

    delete (item as any as Partial<Pdf>).urlSafe;
    return item;
  }
}
