import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('person')
export class AppController {
  // constructor(private readonly appService: AppService) { } // 构造器注入

  // @Inject(AppService) // 属性注入
  // private readonly appService: AppService;

  constructor(
    @Inject('app_service') private readonly appService: AppService, // token为字符串时，注入需要用@Inject手动指定注入对象的token
    @Inject('person') private readonly person: { name: string, age: number },
    @Inject('person2') private readonly person2: { name: string, dec: string },
    @Inject('person3') private readonly person3: { name: string, dec: string },
    @Inject('person4') private readonly person4: { name: string, dec: string },
    @Inject('person5') private readonly person5: { name: string, dec: string },
  ) { }


  @Get()
  getHello(): string {
    console.log(this.person3)
    return this.appService.getHello();
  }
}