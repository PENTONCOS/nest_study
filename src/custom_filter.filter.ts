import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from './CustomException';

@Catch(CustomException)
export class CustomFilterFilter<T> implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      response
        .status(500)
        .json({
          aaa: exception.aaa,
          bbb: exception.bbb
        });
    } else if (host.getType() === 'ws') {

    } else if (host.getType() === 'rpc') {

    }
  }
}
