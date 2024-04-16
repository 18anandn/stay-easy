import { BadRequestException, ValidationError } from '@nestjs/common';

export const validationErrorParse = (
  validationErrors: ValidationError[] = [],
) => {
  const errorMessages: string[] = [];

  return new BadRequestException(
    validationErrors
      .reduce((arr, curr) => {
        if (curr.constraints) {
          arr.push(Object.values(curr.constraints).join(', '));
        }
        return arr;
      }, errorMessages)
      .join('\n'),
  );
};
