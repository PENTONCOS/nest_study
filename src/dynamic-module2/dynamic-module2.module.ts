import { Module } from '@nestjs/common';
import { DynamicModule2Controller } from './dynamic-module2.controller';
import { ConfigurableModuleClass } from './dynamic-module2-definition.module';

@Module({
  controllers: [DynamicModule2Controller]
})
export class DynamicModule2Module extends ConfigurableModuleClass { }
