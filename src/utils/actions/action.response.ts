import { HttpStatus } from "@nestjs/common";

export class ApiResult<T> {
    statusCode: number;
    message: string;
    data: T | null;
    errors: any;
  
    constructor(
      statusCode: number = 200,
      message: string = 'Success',
      data: T | null = null,
      errors: any = null
    ) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.errors = errors;
    }
  
    static success<T>(data: T, message = 'Success'): ApiResult<T> {
      return new ApiResult(HttpStatus.OK, message, data, null);
    }
  
    static error<T>(message: string, statusCode = 400, errors: any = null): ApiResult<T> {
      return new ApiResult(statusCode, message, null, errors);
    }
  }
  