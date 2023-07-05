import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { createClient } from 'redis';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { Person2Module } from './person2/person2.module';
import { Person3Module } from './person3/person3.module';
import { Person4Module } from './person4/person4.module';
import { ModuleTestBModule } from './module-test-b/module-test-b.module';
import { ServiceTestBService } from './service-test-b/service-test-b.service';
import { ServiceTestAService } from './service-test-a/service-test-a.service';
import { DynamicModuleModule } from './dynamic-module/dynamic-module.module';
import { DynamicModule2Module } from './dynamic-module2/dynamic-module2.module';
import { CustomMiddlewareMiddleware } from './custom_middleware.middleware';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import config from './config';
import config2 from './config2';

@Module({
  // imports: [PersonModule],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: [path.join(process.cwd(), '.aaa.env'), path.join(process.cwd(), '.env')]
      load: [config2, config]

    }),
    PersonModule,
    Person2Module, Person3Module,
    Person4Module,
    ModuleTestBModule,
    DynamicModuleModule.register({ // 动态模块引入方法
      name: 'jiapandong',
      age: 20
    }),
    DynamicModule2Module.register({
      name: 'henshao',
      age: 18,
    }),
    UserModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3308,
      username: "root",
      password: "jiapandong",
      database: "typeorm_test",
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      }
    }),
    // JwtModule.register({
    //   secret: 'jiapandong', // 加密 jwt 的密钥
    //   signOptions: {
    //     expiresIn: '7d' // token 过期时间 expiresIn，设置 7 天
    //   }
    // })
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
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
    },
    ServiceTestBService,
    ServiceTestAService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379
          }
        });
        await client.connect();
        return client;
      }
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
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CustomMiddlewareMiddleware).forRoutes({ path: 'user*', method: RequestMethod.GET });
    consumer.apply(CustomMiddlewareMiddleware).forRoutes({ path: 'person2', method: RequestMethod.GET });
  }
}
