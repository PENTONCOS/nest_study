import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // 默认使用的是express
// import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  // 分别指定静态资源的路径和模版的路径，并指定模版引擎为 handlerbars。
  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/static' });
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  // app.use(logger) // 全局中间件
  await app.listen(3000);

  // setTimeout(() => {
  //   // app.close() 只是触发销毁逻辑，但不会真正退出进程
  //   app.close();
  // }, 3000)
}
bootstrap();