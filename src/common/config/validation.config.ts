import { ValidationError } from 'class-validator';
import { ValidationPipeOptions } from '@nestjs/common';
import { ValidationException } from '../exceptions';

export class ValidationConfig implements ValidationPipeOptions {
  public transform = false;

  constructor(config?: ValidationPipeOptions) {
    Object.assign(this, config);
  }

  exceptionFactory(errors: ValidationError[]) {
    const messages: string[] = [];
    errors.forEach((e) => {
      for (const key in e.constraints) {
        messages.push(e.constraints[key]);
      }
    });
    return new ValidationException(messages);
  }
}
