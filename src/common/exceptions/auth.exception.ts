import { CustomException } from './custom.exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../enums/error-codes.enum';

export class AuthException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED, ErrorCodes.AUTH);
  }
}
