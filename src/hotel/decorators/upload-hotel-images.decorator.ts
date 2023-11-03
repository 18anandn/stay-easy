import {
  ParseFilePipe,
  UnprocessableEntityException,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { HotelImageValidator } from '../validators/hotel-image-validator.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export function HotelImageInterceptor() {
  return UseInterceptors(
    FileFieldsInterceptor([{ name: 'main_image' }, { name: 'extra_images' }]),
  )
}

export function UploadHotelImages() {
  return UploadedFiles(
    new ParseFilePipe({
      validators: [
        new HotelImageValidator({
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
