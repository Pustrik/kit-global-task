import { HttpException } from '@nestjs/common';

export abstract class CustomException extends HttpException {
  protected code: number;

  constructor(message: string | string[], status: number, code: number) {
    super({ message: message }, status);
    this.code = code;
  }

  getCode() {
    return this.code;
  }
}
