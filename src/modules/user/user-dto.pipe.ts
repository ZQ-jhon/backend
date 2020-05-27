import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
@Injectable()
export class UserDtoPipe implements PipeTransform {
    /**
     *
     * 管道分为转换和验证两种类型：
     * 1. 转换管道跟 Angular 的 pipe 很像，主要作用是加工数据
     * 2. 验证管道主要用于将数据清洗后，验证是否合规，合规则继续进行业务流程，否则将抛出错误
     *
     * value 实际入参
     * metatype 期望的入参类型
     */
    async transform(value: any, metadata: ArgumentMetadata) {
        // { metatype: [Function: UserDto], type: 'body', data: undefined }
        if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
            return value;
        }
        const object = plainToClass(metadata.metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            throw new BadRequestException(errors.reduce((acc, err) => acc + JSON.stringify(err), ''));
        }
        return value;
    }

    private toValidate(metatype: Function): boolean {
        const types: Function[] = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
}
