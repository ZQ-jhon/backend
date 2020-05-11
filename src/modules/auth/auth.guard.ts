import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { isNil } from 'lodash';
import { UserService } from '../user/user.service';
import { verifyAuthHeader } from '../../util/verify-auth-headers';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly userService: UserService) {}
    async canActivate(context: ExecutionContext) {
        try {
            const authorization = context.switchToHttp().getRequest().headers.authorization as string;
            const id = verifyAuthHeader(authorization);
            if (isNil(id)) {
                throw new Error('Id is invalid, check token and request again!');
            }
            const user = await this.userService.findOne(id).toPromise();
            if (isNil(user)) {
                throw new Error('Token invalid, the user is not exist.');
            }
            return !!user;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
