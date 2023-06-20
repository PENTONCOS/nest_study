import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { ServiceTestAService } from './service-test-a/service-test-a.service';
import { ServiceTestBService } from './service-test-b/service-test-b.service';

@Injectable()
export class AppService {
  constructor(private serviceTestAService: ServiceTestAService, private serviceTestBService: ServiceTestBService) { }

  getHello(): string {
    return this.serviceTestAService.ddd() + this.serviceTestBService.eee();
  }

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async getHello11() {
    const value = await this.redisClient.keys('*');
    console.log(value);

    return 'Hello World!';
  }
}
