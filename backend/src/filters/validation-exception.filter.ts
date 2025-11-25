import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import _ = require('lodash');

import { Response } from 'express';

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionErrorResponse: any = exception.getResponse();
    const error_code =
      status == 400 && !exceptionErrorResponse.error_code
        ? 'MISSING_REQUIRE_FIELD'
        : exceptionErrorResponse.error_code;
    let message =
      exceptionErrorResponse.data?.message ||
      exceptionErrorResponse.message ||
      exception.message;

    if (_.isArray(message)) {
      message = _.join(message, ' & ');
    }

    response.status(status).json({
      status_code: status,
      error_code,
      data: {
        ...exceptionErrorResponse.data,
        message,
      },
    });
  }
}
