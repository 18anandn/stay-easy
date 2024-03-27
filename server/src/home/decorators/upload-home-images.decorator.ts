import {
  ParseFilePipe,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { HomeImageValidator } from '../validators/home-image-validator.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export function HomeImageInterceptor() {
  return UseInterceptors(
    FileFieldsInterceptor([{ name: 'main_image' }, { name: 'extra_images' }]),
  )
}

export function UploadHomeImages() {
  return UploadedFiles(
    new ParseFilePipe({
      validators: [
        new HomeImageValidator({
          mainImages: {
            min: 1,
            max: 1,
          },
          extraImages: {
            min: 0,
            max: 5,
          },
        }),
      ],
      exceptionFactory: (error) => {
        throw new UnprocessableEntityException(error);
      },
    }),
  );
}
