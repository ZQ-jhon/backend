import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * 1. using controller method:
 * ```typescript
 * @UseFilter(HttpExceptionFilter)
 * public getUser(id: string) {
 *   throw new HttpException();
 * }
 * ```
 * 2. using controller
 * ```typescript
 *
 * @UseFilter(HttpExceptionFilter)
 * export class UserController {
 * // ...
 * }
 * ```
 * 3. using global
 * ```typescript
 * app.usingGlobalFilters(new HttpExceptionFilter());
 * ```
 *
 */
@Catch()
export class HttpExceptionFilter<T> implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}
