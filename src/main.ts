import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // 默认使用的是express
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import * as session from 'express-session';
import { join } from 'path';
import { AppModule } from './app.module';
import { MyLogger } from './MyLogger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: false // 关闭 打印日志
    // logger: new MyLogger() // 自定义打印日志格式
  });

  // session + cookie
  app.use(session({
    secret: 'jiapandong',
    resave: false, // resave 为 true 是每次访问都会更新 session，不管有没有修改 session 的内容，而 false 是只有 session 内容变了才会去更新 session。
    saveUninitialized: false // saveUninitalized 设置为 true 是不管是否设置 session，都会初始化一个空的 session 对象。比如你没有登录的时候，也会初始化一个 session 对象，这个设置为 false 就好。
  }));
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // 分别指定静态资源的路径和模版的路径，并指定模版引擎为 handlerbars。
  // app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' });
  // app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.setBaseViewsDir(join(__dirname, '..', 'views'));
  // app.setViewEngine('hbs');

  // app.use(logger) // 全局中间件
  await app.listen(3000);

  // setTimeout(() => {
  //   // app.close() 只是触发销毁逻辑，但不会真正退出进程
  //   app.close();
  // }, 3000)
}
bootstrap();