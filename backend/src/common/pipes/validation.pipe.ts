import {
  ValidationPipe,
  ValidationError,
  UnprocessableEntityException,
} from '@nestjs/common';

// Hàm tuỳ chỉnh ValidationPipe
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      const errors = validationErrors.map((error) => {
        return {
          field: error.property,
          message: Object.values(error.constraints),
        };
      });
      return new UnprocessableEntityException(errors);
    },
    whitelist: true,
  });
}
