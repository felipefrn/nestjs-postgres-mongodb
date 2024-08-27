import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient as PostgresPrismaClient } from '@prisma/postgres/client';

@Injectable()
export class PostgresPrismaService
  extends PostgresPrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PostgresPrismaService.name);

  async onModuleInit() {
    let retries = 5;
    while (retries > 0) {
      try {
        await this.$connect();

        this.logger.log('Successfully connected to the Postgres database');

        break;
      } catch (error) {
        this.logger.error(error);

        this.logger.error(
          `There was an error connecting to database, retrying ...(${retries})`,
        );

        retries -= 1;

        await new Promise((res) => setTimeout(res, 3_000));
      }
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
