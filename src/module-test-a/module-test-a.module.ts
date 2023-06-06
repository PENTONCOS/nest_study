import { Module, forwardRef } from '@nestjs/common';
import { ModuleTestBModule } from 'src/module-test-b/module-test-b.module';

@Module({
  imports: [forwardRef(() => ModuleTestBModule)] // 模块循环引用
})
export class ModuleTestAModule { }
