import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { MemoryStoredFile } from 'nestjs-form-data';

export function IsExtensionMatchingFileType(
  validationOptions?: ValidationOptions,
) {
  const message = "File extension does not match it's type";
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isExtensionMatchingFileType',
      target: object.constructor,
      propertyName: propertyName,
      options: { message, ...validationOptions },
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          return (
            value !== null &&
            value !== undefined &&
            value instanceof MemoryStoredFile &&
            value['busBoyMimeType'] === value.mimeType
          );
        },
      },
    });
  };
}
