import { Controller, Get, Inject } from '@nestjs/common';
import { DynamicModule2ModuleOptions, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE } from './dynamic-module2-definition.module';

@Controller('dynamic-module2')
export class DynamicModule2Controller {

  @Inject(MODULE_OPTIONS_TOKEN)
  private options: typeof OPTIONS_TYPE;


  @Get()
  hello() {
    console.log(OPTIONS_TYPE)
    return this.options;
  }
}
