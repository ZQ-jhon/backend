import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { verifyAuthHeader } from '../../util/verify-auth-headers';
import { LogDTO } from './log.dto';
import { LogService } from './log.service';
import { CustomResponse } from '../../interfaces/custom-response.interface';
import { CustomRequest } from '../../interfaces/custom-request.interface';
import { switchMapTo } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from './log.entity';
import { Repository } from 'typeorm';
@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private readonly logService: LogService,
    @InjectRepository(Log)
    private readonly logRepository: Repository<Log>,
  ) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = this.getRequestContent(context.switchToHttp().getRequest<Request>());
    context.switchToHttp().getResponse<Response>();
    const response = this.getResponseContent(context.switchToHttp().getResponse<Response>());
    const dto = {
      content: Math.floor(response.status / 200) === 1 ? request.path : JSON.stringify(response),
      request,
      response,
      operatorId: request.userId,
    } as LogDTO;
    return this.logService.save(dto).pipe(switchMapTo(next.handle()));
  }


  private getRequestContent(_doc: Request): CustomRequest {
    return {
      method: _doc.method || '',
      userAgent: _doc.headers["user-agent"],
      path: _doc.path || '',
      query: JSON.stringify(_doc.query) || null,
      body: _doc.body || null,
      params: JSON.stringify(_doc.params) || null,
      userId: verifyAuthHeader(_doc.headers.authorization || ''),
      contentType: _doc.headers["content-type"] || '',
    };
  }

  private getResponseContent(_doc: Response): CustomResponse {
    return {
      status: _doc.status || 200,
      message: _doc.statusText || null,
    };
  }
}
