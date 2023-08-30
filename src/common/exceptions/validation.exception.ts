import { HttpStatus } from '@nestjs/common';

import { CustomException } from './custom.exception';
import { ErrorCodes } from '../enums/error-codes.enum';

export class ValidationException extends CustomException {
  constructor(messages: string | string[]) {
    super(messages, HttpStatus.BAD_REQUEST, ErrorCodes.VALIDATION);
  }
}
