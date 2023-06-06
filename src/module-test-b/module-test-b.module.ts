import { Module, forwardRef } from '@nestjs/common';
import { ModuleTestAModule } from 'src/module-test-a/module-test-a.module';

@Module({
  imports: [forwardRef(() => ModuleTestAModule)]  // 模块循环引用
})
export class ModuleTestBModule { }
