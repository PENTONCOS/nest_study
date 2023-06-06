import { CanActivate, ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class CustomDecoratorGuard implements CanActivate {
  @Inject(Reflector)  // Nest 注入 reflector，不需要在模块的 provider 声明
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log(this.reflector.get('custom_decorator', context.getHandler()));

    return true;
  }
}
