import { CustomException } from './custom.exception';
import { HttpStatus } from '@nestjs/common';
import { ErrorCodes } from '../enums/error-codes.enum';

export class NotFoundException extends CustomException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND);
  }
}
