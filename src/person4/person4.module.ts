import { Module, OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown } from '@nestjs/common';
import { Person4Service } from './person4.service';
import { Person4Controller } from './person4.controller';

@Module({
  controllers: [Person4Controller],
  providers: [Person4Service]
})
export class Person4Module implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {

  onModuleDestroy() {
    console.log('Person4Module onModuleDestroy');
  }

  beforeApplicationShutdown(signal: string) {
    console.log('Person4Module beforeApplicationShutdown', signal);
  }

  onApplicationShutdown() {
    console.log('Person4Module onApplicationShutdown');
  }
  onModuleInit() {
    console.log('Person4Module onModuleInit')
  }
  onApplicationBootstrap() {
    console.log('Person4Module onApplicationBootstrap')
  }
}
