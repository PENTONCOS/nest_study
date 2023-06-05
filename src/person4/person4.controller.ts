import { Controller, Get, Post, Body, Patch, Param, Delete, OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown } from '@nestjs/common';
import { Person4Service } from './person4.service';
import { CreatePerson4Dto } from './dto/create-person4.dto';
import { UpdatePerson4Dto } from './dto/update-person4.dto';

@Controller('person4')
export class Person4Controller implements OnModuleInit, OnApplicationBootstrap, OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
  constructor(private readonly person4Service: Person4Service) { }

  onModuleDestroy() {
    console.log('Person4Controller onModuleDestroy');
  }

  beforeApplicationShutdown(signal: string) {
    console.log('Person4Controller beforeApplicationShutdown', signal);
  }

  onApplicationShutdown() {
    console.log('Person4Controller onApplicationShutdown');
  }

  onModuleInit() {
    console.log('Person4Controller onModuleInit')
  }
  onApplicationBootstrap() {
    console.log('Person4Controller onApplicationBootstrap')
  }

  @Post()
  create(@Body() createPerson4Dto: CreatePerson4Dto) {
    return this.person4Service.create(createPerson4Dto);
  }

  @Get()
  findAll() {
    return this.person4Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.person4Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerson4Dto: UpdatePerson4Dto) {
    return this.person4Service.update(+id, updatePerson4Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.person4Service.remove(+id);
  }
}
