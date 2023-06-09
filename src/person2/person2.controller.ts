import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Logger } from '@nestjs/common';
import { Person2Service } from './person2.service';
import { CreatePerson2Dto } from './dto/create-person2.dto';
import { UpdatePerson2Dto } from './dto/update-person2.dto';

@Controller('person2')
export class Person2Controller {

  private logger = new Logger();
  constructor(private readonly person2Service: Person2Service) { }

  @Post('ooo')
  create(@Body(new ValidationPipe()) createPerson2Dto: CreatePerson2Dto) {
    console.log('createPerson2Dto', createPerson2Dto)
    // return this.person2Service.create(createPerson2Dto);
  }

  @Get()
  findAll() {
    this.logger.debug('aaa', Person2Controller.name);
    this.logger.error('bbb', Person2Controller.name);
    this.logger.log('ccc', Person2Controller.name);
    this.logger.verbose('ddd', Person2Controller.name);
    this.logger.warn('eee', Person2Controller.name);
    return this.person2Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.person2Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePerson2Dto: UpdatePerson2Dto) {
    return this.person2Service.update(+id, updatePerson2Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.person2Service.remove(+id);
  }
}
