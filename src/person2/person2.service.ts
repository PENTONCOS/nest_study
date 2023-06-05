import { Injectable } from '@nestjs/common';
import { CreatePerson2Dto } from './dto/create-person2.dto';
import { UpdatePerson2Dto } from './dto/update-person2.dto';

@Injectable()
export class Person2Service {
  create(createPerson2Dto: CreatePerson2Dto) {
    return 'This action adds a new person2';
  }

  findAll() {
    return `This action returns all person2`;
  }

  findOne(id: number) {
    return `This action returns a #${id} person2`;
  }

  update(id: number, updatePerson2Dto: UpdatePerson2Dto) {
    return `This action updates a #${id} person2`;
  }

  remove(id: number) {
    return `This action removes a #${id} person2`;
  }
}
