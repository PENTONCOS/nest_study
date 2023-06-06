import { Injectable, OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown } from '@nestjs/common';
import { CreatePerson3Dto } from './dto/create-person3.dto';
import { UpdatePerson3Dto } from './dto/update-person3.dto';

@Injectable()
export class Person3Service implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {

  onModuleDestroy() {
    // console.log('Person3Service onModuleDestroy');
  }

  beforeApplicationShutdown(signal: string) {
    // console.log('Person3Service beforeApplicationShutdown', signal);
  }

  onApplicationShutdown() {
    // console.log('Person3Service onApplicationShutdown');
  }
  onModuleInit() {
    // console.log('Person3Service onModuleInit')
  }
  onApplicationBootstrap() {
    // console.log('Person3Service onApplicationBootstrap')
  }

  create(createPerson3Dto: CreatePerson3Dto) {
    return 'This action adds a new person3';
  }

  findAll() {
    return `This action returns all person3`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person3`;
  }

  update(id: number, updatePerson3Dto: UpdatePerson3Dto) {
    return `This action updates a #${id} person3`;
  }

  remove(id: number) {
    return `This action removes a #${id} person3`;
  }
}
