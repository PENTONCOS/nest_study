import { Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Inject, Param, ParseArrayPipe, ParseBoolPipe, ParseEnumPipe, ParseFloatPipe, ParseIntPipe, ParseUUIDPipe, Query, SetMetadata, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomDecoratorGuard } from './custom_decorator.guard';
import { CustomDecorator } from './custom_decorator.decorator';
import { Custom2Decorator } from './custom2_decorator.decorator';
import { MyQuery } from './myQuery.decorator';
import { ClassCustomDecorator } from './class_custom_decorator.decorator';
import { CustomException } from './CustomException';
import { CustomFilterFilter } from './custom_filter.filter';
import { CustomGuardGuard } from './custom_guard.guard';
import { CustomInterceptorInterceptor } from './custom_intercept.intercept';
import { CustomPipePipe } from './custom_pipe.pipe';


enum Ggg {
  AAA = '111',
  BBB = '222',
  CCC = '333'
}

@Controller('person')
// @ClassCustomDecorator() // 自定义 class 装饰器
@SetMetadata('roles', ['user'])
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

  @Get('hello11')
  async getHello11() {
    return await this.appService.getHello11();
  }

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

  @Get('hello5')
  @UseFilters(CustomFilterFilter) // 自定义异常捕获
  @UseGuards(CustomGuardGuard) // 自定义 guard
  getHello5(): string {
    throw new CustomException('aaa', 'bbb')
    return this.appService.getHello();
  }

  @Get('hello6')
  @UseGuards(CustomGuardGuard) // 自定义 guard
  @UseInterceptors(CustomInterceptorInterceptor) // 自定义 interceptor
  @SetMetadata('roles', ['admin'])
  getHello6(): string {
    return this.appService.getHello();
  }

  @Get()
  asd(@Query('aa', ParseIntPipe) aa: string): string {
    return aa + 1;
  }

  @Get('aa')
  aa(@Query('aa', new ParseIntPipe({
    errorHttpStatusCode: HttpStatus.NOT_FOUND
  })) aa: string): string {
    return aa + 1;
  }

  @Get('bb')
  bb(@Query('aa', new ParseIntPipe({
    exceptionFactory: (msg) => {
      console.log(msg);
      throw new HttpException('xxx ' + msg, HttpStatus.NOT_IMPLEMENTED)
    }
  })) aa: string): string {
    return aa + 1;
  }

  @Get('cc')
  cc(@Query('cc', ParseFloatPipe) cc: number) {
    return cc + 1;
  }

  @Get('dd')
  dd(@Query('dd', ParseBoolPipe) dd: boolean) {
    return typeof dd
  }

  @Get('ee')
  ee(@Query('ee', new ParseArrayPipe({
    items: Number
  })) ee: Array<number>) {
    return ee.reduce((total, item) => total + item, 0)
  }

  @Get('ff')
  ff(@Query('ff', new ParseArrayPipe({
    separator: '..',
    optional: true
  })) ff: Array<string>) {
    return ff;
  }

  @Get('gg/:enum')
  gg(@Param('enum', new ParseEnumPipe(Ggg)) e: Ggg) {
    return e;
  }

  @Get('hh/:uuid')
  hh(@Param('uuid', new ParseUUIDPipe()) uuid: string) {
    return uuid;
  }

  @Get('kkk')
  kkk(@Query('kkk', new DefaultValuePipe('aaa')) kkk: string) {
    return kkk;
  }

  @Get('hello7/:bbb')
  getHello7(@Query('aaa', CustomPipePipe) aaa: string, @Param('bbb', CustomPipePipe) bbb: number) {
    return aaa + bbb;
  }
}