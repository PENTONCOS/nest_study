import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseInterceptors, UploadedFiles, HostParam, Req, Res, Next, HttpCode, Header, Redirect, Render } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

// @Controller('api/person')
@Controller({ host: ':host.0.0.1', path: 'aaa' }) // controller 除了可以指定某些 path 生效外，还可以指定 host：
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  @Get('bbb')
  hello(@HostParam('host') host: number) {
    return host;
  }

  @Get('ccc')
  ccc(@Req() req: Request) {
    // console.log(req)
  }

  @Get('ddd')
  ddd(@Res() res: Response) {
    return res.end('henshao dddd') // Nest 这么设计是为了避免你自己返回的响应和 Nest 返回的响应的冲突。
  }

  @Get('eee')
  eee(@Res({ passthrough: true }) res: Response) { // 如果你不会自己返回响应，可以通过 passthrough 参数告诉 Nest
    return 'henshao eeee'
  }

  @Get('fff')
  fff(@Next() nest: NextFunction) {
    console.log('hander1');
    nest();
    return '111';
  }

  @Get('fff')
  fff2() {
    console.log('hander2');
    return 'fff';
  }

  @Get('ggg')
  @HttpCode(233)
  @Header('name', 'jiapandong')
  ggg() {
    return 'ggg';
  }

  @Get('hhh')
  @Redirect('https://blog.csdn.net/Pentoncos')
  hhh() {

  }

  @Get('user')
  @Render('user')
  user() {
    return { name: 'jiapandong', age: 20 }
  }


  // 1. url query
  // 通过@Query(参数名)取出注入到controller
  // 注意，这个 find 的路由要放到 :id 的路由前面，因为 Nest 是从上往下匹配的，如果放在后面，那就匹配到 :id 的路由了
  @Get('find')
  query(@Query('name') name: string, @Query('age') age: number) {
    return `received: name=${name}, age=${age}`

  }

  // 2. url param
  // 通过@Param(参数名)取出注入到controller
  // @Controller('api/person') 的路由和 @Get(':id') 的路由会拼到一起，也就是只有 /api/person/xxx 的 get 请求才会走到这个方法。
  @Get(':id')
  urlParam(@Param('id') id: string) {
    return `received: id=${id}`
  }

  // 3. form urlencoded
  // 4. json
  // 用 Nest 接收的话，使用 @Body 装饰器，Nest 会解析请求体，然后注入到 dto 中。
  // dto 是 data transfer object，就是用于封装传输的数据的对象
  @Post()
  create(@Body() createPersonDto: CreatePersonDto) {
    // return this.personService.create(createPersonDto);
    return `received: ${JSON.stringify(createPersonDto)}`;
  }

  // 5. form data
  // Nest 解析 form data 使用 FilesInterceptor 的拦截器，用 @UseInterceptors 装饰器启用，然后通过 @UploadedFiles 来取。非文件的内容，同样是通过 @Body 来取。
  @Post('file')
  @UseInterceptors(AnyFilesInterceptor({
    dest: 'uploads/', // 上传后文件所在路径
  }))
  body(@Body() createPersonDto: CreatePersonDto, @UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return `received: ${JSON.stringify(createPersonDto)}`
  }





  @Get()
  findAll() {
    return this.personService.findAll();
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
