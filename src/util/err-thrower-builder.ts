import { throwError } from "rxjs";
import { HttpException, HttpStatus } from "@nestjs/common";

export const errThrowerBuilder = (err: Error, info: string, code: HttpStatus) => throwError(new HttpException(`[${info}]: ${err.message}`, code));