import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { isNullOrUndefined } from 'util';

export function verifyAuthHeader(authHeader: string) {
    if (isNullOrUndefined(authHeader)) {
        throw new HttpException('Token empty.', HttpStatus.FORBIDDEN);
    }
    const token: string = authHeader.split(' ').pop();
    let id: string;
    try {
        const { userId } = jwt.decode(token) as { userId: string };
        id = userId;
    } catch (error) {
        throw new HttpException('Token error.', HttpStatus.FORBIDDEN);
    }
    return id;
}
