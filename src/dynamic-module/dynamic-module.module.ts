import { Module, DynamicModule } from '@nestjs/common';
import { DynamicModuleService } from './dynamic-module.service';
import { DynamicModuleController } from './dynamic-module.controller';

@Module({})
export class DynamicModuleModule {
  static register(options: Record<string, any>): DynamicModule { // 动态模块注册方法
    return {
      module: DynamicModuleModule,
      controllers: [DynamicModuleController],
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        DynamicModuleService,
      ],
      exports: []
    };
  }

}
