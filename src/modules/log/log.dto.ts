import { IsString } from 'class-validator';

export class LogDTO {
    @IsString()
    operatorId: string;
    request?: any;
    response?: any;
    @IsString()
    content: string;
}
