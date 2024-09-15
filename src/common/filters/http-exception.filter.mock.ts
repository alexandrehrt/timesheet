// src/common/filters/http-exception.filter.mock.ts
import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilterMock implements ExceptionFilter {
  catch() {}
}
