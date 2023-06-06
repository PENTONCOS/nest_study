import { Module, OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Person3Service } from './person3.service';
import { Person3Controller } from './person3.controller';

@Module({
  controllers: [Person3Controller],
  providers: [Person3Service]
})
export class Person3Module implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  constructor(public moduleRef: ModuleRef) { }
  onModuleDestroy() {
    console.log('Person3Module onModuleDestroy');
  }

  beforeApplicationShutdown(signal: string) {
    // console.log('Person3Module beforeApplicationShutdown', signal);
  }

  onApplicationShutdown() {
    const person3Service = this.moduleRef.get<Person3Service>(Person3Service) // 这里的 moduleRef 就是当前模块的对象。
    // console.log('----------------', person3Service.findAll())
    // console.log('Person3Module onApplicationShutdown');
  }
  onModuleInit() {
    // console.log('Person3Module onModuleInit')
  }
  onApplicationBootstrap() {
    // console.log('Person3Module onApplicationBootstrap')
  }
}
