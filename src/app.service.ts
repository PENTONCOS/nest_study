import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from 'redis';
import { ServiceTestAService } from './service-test-a/service-test-a.service';
import { ServiceTestBService } from './service-test-b/service-test-b.service';

@Injectable()
export class AppService {
  constructor(private serviceTestAService: ServiceTestAService, private serviceTestBService: ServiceTestBService) { }

  @Inject(ConfigService)
  private configService: ConfigService;

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  getHello(): string {
    console.log('configService', this.configService)
    return this.serviceTestAService.ddd() + this.serviceTestBService.eee();
  }



  async getHello11() {
    const value = await this.redisClient.keys('*');
    console.log(value);

    return 'Hello World!';
  }
}
