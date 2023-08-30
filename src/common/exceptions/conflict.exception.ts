import { CustomException } from './custom.exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../enums/error-codes.enum';

export class ConflictException extends CustomException {
  constructor(message: string | string[]) {
    super(message, HttpStatus.CONFLICT, ErrorCodes.AUTH);
  }
}
