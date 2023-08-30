import { CustomException } from './custom.exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../enums/error-codes.enum';

export class ForbiddenException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN, ErrorCodes.AUTH);
  }
}
