import { Injectable, OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown } from '@nestjs/common';
import { CreatePerson4Dto } from './dto/create-person4.dto';
import { UpdatePerson4Dto } from './dto/update-person4.dto';

@Injectable()
export class Person4Service implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  onModuleDestroy() {
    // console.log('Person4Service onModuleDestroy');
  }

  beforeApplicationShutdown(signal: string) {
    // console.log('Person4Service beforeApplicationShutdown', signal);
  }

  onApplicationShutdown() {
    // console.log('Person4Service onApplicationShutdown');
  }
  onModuleInit() {
    // console.log('Person4Service onModuleInit')
  }
  onApplicationBootstrap() {
    // console.log('Person4Service onApplicationBootstrap')
  }

  create(createPerson4Dto: CreatePerson4Dto) {
    return 'This action adds a new person4';
  }

  findAll() {
    return `This action returns all person4`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person4`;
  }

  update(id: number, updatePerson4Dto: UpdatePerson4Dto) {
    return `This action updates a #${id} person4`;
  }

  remove(id: number) {
    return `This action removes a #${id} person4`;
  }
}
