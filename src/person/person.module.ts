import { Module, Global } from '@nestjs/common';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';

// 声明为全局模块
@Global()
@Module({
  controllers: [PersonController],
  providers: [PersonService],
  exports: [PersonService]
})
export class PersonModule { }
