import { applyDecorators, Get, UseGuards } from '@nestjs/common';
import { CustomDecorator } from './custom_decorator.decorator';
import { CustomDecoratorGuard } from './custom_decorator.guard';

export function Custom2Decorator(path, role) {
  return applyDecorators( // 通过 applyDecorators 来调用其他装饰器
    Get(path),
    CustomDecorator(role),
    UseGuards(CustomDecoratorGuard)
  )
}
