import { Controller, Get, Inject, SetMetadata, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomDecoratorGuard } from './custom_decorator.guard';
import { CustomDecorator } from './custom_decorator.decorator';
import { Custom2Decorator } from './custom2_decorator.decorator';
import { MyQuery } from './myQuery.decorator';
import { ClassCustomDecorator } from './class_custom_decorator.decorator';

// @Controller('person')
@ClassCustomDecorator()
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
  @SetMetadata('custom_decorator', 'admin')
  @UseGuards(CustomDecoratorGuard)
  getHello(): string {
    console.log(this.person3)
    return this.appService.getHello();
  }

  @Get('hello2')
  @CustomDecorator('admin2') // 自定义方法装饰器
  @UseGuards(CustomDecoratorGuard)
  getHello2(): string {
    return this.appService.getHello();
  }

  @Custom2Decorator('hello3', 'admin3') // 合并多个方法装饰器
  getHello3(): string {
    return this.appService.getHello();
  }

  @Get('hello4')
  getHello4(@MyQuery('name') name: string): string {  // @MyQuery 为自定义参数装饰器
    console.log('name', name)
    return this.appService.getHello();
  }
}