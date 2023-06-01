import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

@Controller('api/person')
export class PersonController {
  constructor(private readonly personService: PersonService) { }



  @Get()
  findAll() {
    return this.personService.findAll();
  }

  // 1. url query请求方式 
  // 通过@Query(参数名)取出注入到controller
  // 注意，这个 find 的路由要放到 :id 的路由前面，因为 Nest 是从上往下匹配的，如果放在后面，那就匹配到 :id 的路由了
  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return `received: name=${name}, age=${age}`

  }

  // 2. url param请求方式 
  // 通过@Param(参数名)取出注入到controller
  // @Controller('api/person') 的路由和 @Get(':id') 的路由会拼到一起，也就是只有 /api/person/xxx 的 get 请求才会走到这个方法。
  @Get(':id')
  urlParam(@Param('id') id: string) {
    return `received: id=${id}`
  }

  // 3. form urlencoded / json 请求方式
  // 用 Nest 接收的话，使用 @Body 装饰器，Nest 会解析请求体，然后注入到 dto 中。
  // dto 是 data transfer object，就是用于封装传输的数据的对象
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    // return this.personService.create(createPersonDto);
    return `received: ${JSON.stringify(createPersonDto)}`;
  }


  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.personService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
    return this.personService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.personService.remove(+id);
  }
}
