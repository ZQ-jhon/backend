import { HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { isNullOrUndefined } from 'util';

export function verifyAuthHeader(authHeader: string) {
  if (isNullOrUndefined(authHeader)) {
    throw new HttpException('Token empty.', HttpStatus.FORBIDDEN);
  }
  const token: string = authHeader.split(' ').pop();
  let userId: string;
  try {
    const { id } = jwt.decode(token) as { id: string };
    userId = id;
  } catch (error) {
    console.log('error: ', error.message);
    throw new HttpException('Token error.', HttpStatus.FORBIDDEN);
  }
  return userId;
}
