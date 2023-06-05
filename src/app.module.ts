import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { Person2Module } from './person2/person2.module';
import { Person3Module } from './person3/person3.module';
import { Person4Module } from './person4/person4.module';

@Module({
  // imports: [PersonModule],
  imports: [PersonModule, Person2Module, Person3Module, Person4Module],
  controllers: [AppController],
  // providers: [AppService],

  // 完整写法
  providers: [
    AppService,
    // {
    //   provide: AppService,
    //   useClass: AppService,
    // },
    {
      provide: 'app_service', // 这个 token 为字符串
      useClass: AppService
    },
    {
      provide: 'person', // 使用 provide 指定 token，使用 useValue 指定值。
      useValue: {
        name: 'jiapandong',
        age: 20
      }
    },
    {
      provide: 'person2', // 使用 useFactory 来动态创建一个对象。
      useFactory() {
        return {
          name: 'henshao',
          dec: '你好'
        }
      }
    },
    {
      provide: 'person3', // 使用 useFactory 来动态创建一个对象。
      useFactory(person: { name: string }, appService: AppService) {
        return {
          name: person.name,
          dec: appService.getHello()
        }
      },
      inject: ['person', AppService]
    },
    {
      provide: 'person4', // useFactory 支持异步
      async useFactory() {
        await new Promise((resolve) => {
          setTimeout(resolve, 3000);
        });
        return {
          name: 'henshao',
          desc: '我很好'
        }
      },
    },
    {
      provide: 'person5', // 通过 useExisting 来指定别名
      useExisting: 'person2' // 这里就是给 person2 的 token 的 provider 起个新的 token 叫做 person5。
    }
  ]
})
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(LoggerMiddleware) // 路由中间件
//       .forRoutes('person')
//   }
// }
export class AppModule { }
