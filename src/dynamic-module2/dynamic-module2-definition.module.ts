import { ConfigurableModuleBuilder } from "@nestjs/common";

export interface DynamicModule2ModuleOptions {
  name: string;
  age: number;
}

// ConfigurableModuleBuilder 也是一种自动创建动态module的方法
export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<DynamicModule2ModuleOptions>().setClassMethodName('register').setExtras({
    isGlobal: true
  }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  })).build();
