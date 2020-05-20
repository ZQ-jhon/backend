import { IsString } from 'class-validator';

export class LogDTO {
    @IsString()
    operatorId = '';
    request? = {};
    response? = {};
    @IsString()
    content = '';
}
