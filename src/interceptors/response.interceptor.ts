import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from 'express';
import { ApiResult } from 'src/utils/actions/action.response';


export interface IResponse<T> {
    statusCode: number;
    message: string;
    data: T;
    errors: any;
}

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, IResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<IResponse<T>> {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        return next.handle().pipe(
            map((data) => {
                if (data instanceof ApiResult) {
                    return data;
                } else {
                    return ApiResult.success(data);
                }
            }),
        );
    }
}


@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const message = exception.message;
        response.status(status).json(ApiResult.error(message, status, exception.getResponse()));
    }
}