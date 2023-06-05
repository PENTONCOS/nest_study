import { Module } from '@nestjs/common';
import { Person2Service } from './person2.service';
import { Person2Controller } from './person2.controller';
// import { PersonModule } from 'src/person/person.module';

@Module({
  // imports: [PersonModule],
  imports: [],
  controllers: [Person2Controller],
  providers: [Person2Service]
})
export class Person2Module { }
