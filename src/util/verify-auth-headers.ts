import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import { JWT_SECRET } from '../constants/jwt-secret';

export function verifyAuthHeader(authHeader: string) {
    if (isNil(authHeader)) {
        throw new HttpException('Token empty.', HttpStatus.FORBIDDEN);
    }
    const token: string = authHeader.split(' ').pop();
    let id: string;
    try {
        jwt.verify(token, JWT_SECRET);
        const { userId } = jwt.decode(token) as { userId: string };
        id = userId;
    } catch (error) {
        throw new HttpException(`Token Error: ${error}`, HttpStatus.FORBIDDEN);
    }
    return id;
}
