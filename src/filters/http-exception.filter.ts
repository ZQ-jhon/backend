import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LogService } from '../modules/log/log.service';
import { LogDTO } from '../modules/log/log.dto';
import { verifyAuthHeader } from '../util/verify-auth-headers';
import { CustomResponse } from '../interfaces/custom-response.interface';

/**
 *
 * Filter 主要用于捕获异常， `exception` 表示当前 handle 的异常， host 可以理解为发生异常的宿主控制器 host-controller
 *
 *
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
    constructor(private readonly logService: LogService) { }
    async catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception?.getStatus() || 400;
        const err = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: exception.message,
        };
        let operatorId, dto;
        try {
            operatorId = verifyAuthHeader(request.headers?.authorization);
        } catch (err) {
            dto = {
                content: err.message,
                operatorId: operatorId,
                request: {
                    path: request.path,
                    method: request.method,
                    userAgent: request.headers['user-agent'],
                    body: request.body,
                    query: request.query,
                    params: request.params,
                    contentType: request.headers['content-type'],
                } as Partial<Request>,
                response: {
                    status: response.statusCode,
                    message: response.statusMessage,
                } as CustomResponse,
            } as LogDTO;
        }
        await this.logService.save(dto);
        response.status(status).json(err);
    }
}
