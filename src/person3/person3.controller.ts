import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown } from '@nestjs/common';
import { Person3Service } from './person3.service';
import { CreatePerson3Dto } from './dto/create-person3.dto';
import { UpdatePerson3Dto } from './dto/update-person3.dto';

@Controller('person3')
export class Person3Controller implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  constructor(private readonly person3Service: Person3Service) { }


  onModuleDestroy() {
    console.log('Person3Controller onModuleDestroy');
  }

  beforeApplicationShutdown(signal: string) {
    console.log('Person3Controller beforeApplicationShutdown', signal);
  }

  onApplicationShutdown() {
    console.log('Person3Controller onApplicationShutdown');
  }

  onModuleInit() {
    console.log('Person3Controller onModuleInit')
  }
  onApplicationBootstrap() {
    console.log('Person3Controller onApplicationBootstrap')
  }


  @Post()
  create(@Body() createPerson3Dto: CreatePerson3Dto) {
    return this.person3Service.create(createPerson3Dto);
  }

  @Get()
  findAll() {
    return this.person3Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.person3Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerson3Dto: UpdatePerson3Dto) {
    return this.person3Service.update(+id, updatePerson3Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.person3Service.remove(+id);
  }
}
