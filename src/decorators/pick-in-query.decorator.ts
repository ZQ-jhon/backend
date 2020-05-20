import { createParamDecorator, ExecutionContext } from '@nestjs/common';


/**
 * 根据给定的 prop 从 query 中自动提取对应属性并返回
 */
export const PickInQuery = createParamDecorator((prop: string, req: ExecutionContext) => {
    const query = req.switchToHttp().getRequest()?.query;
    if (query[prop]) {
        return query[prop];
    }     
});
