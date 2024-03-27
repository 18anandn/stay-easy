import { FileValidator } from '@nestjs/common';
import { UploadImages } from '../dtos/images.dto';
import { fromBuffer } from 'file-type';

type FileOptions = {
  mainImages: {
    min: number;
    max: number;
  };
  extraImages: {
    min: number;
    max: number;
  };
};

const validTypes = ['png', 'jpg', 'jpeg'];
const validMimes = validTypes.map((val) => `image/${val}`);

const maxSizeInKB = 1000;
const maxSize = maxSizeInKB * 1000;
const errorSizeMessgae = 'Max size allowed is 1MB';

export class HomeImageValidator extends FileValidator {
  errorMessage = 'Invalid image request';
  constructor(public options: FileOptions) {
    super(options);
  }

  async isValid(files?: UploadImages): Promise<boolean> {
    try {
      if (!files) {
        throw new Error('No images were provided');
      }
      const { main_image, extra_images } = files;
      if (!main_image) {
        throw new Error('Main Image was not provided');
      }
      if (main_image.length === 0) {
        throw new Error('Provide main image');
      }
      if (main_image.length < this.options.mainImages.min) {
        throw new Error(
          `There should be atleast ${this.options.mainImages.min} main image${
            this.options.mainImages.min > 1 ? 's' : ''
          }.`,
        );
      }
      if (main_image.length > this.options.mainImages.max) {
        throw new Error(
          `There can be only ${this.options.mainImages.max} main image${
            this.options.mainImages.max > 1 ? 's' : ''
          }.`,
        );
      }
      for (let image of main_image) {
        if (image.size > maxSize) {
          throw new Error(errorSizeMessgae);
        }
        const fileType = await fromBuffer(image.buffer);
        if (!validMimes.includes(fileType?.mime ?? '')) {
          throw new Error('Invalid file(s) uploaded');
        }
      }
      if (this.options.extraImages.min > 0) {
        if (!extra_images) {
          throw new Error('Extra Images were not provided');
        }
        if (extra_images.length === 0) {
          throw new Error('Provide extra images');
        }
        if (extra_images.length < this.options.extraImages.min) {
          throw new Error(
            `There should be atleast ${
              this.options.extraImages.min
            } extra image${this.options.extraImages.min > 1 ? 's' : ''}.`,
          );
        }
      }
      if (extra_images) {
        if (extra_images.length > this.options.extraImages.max) {
          throw new Error(
            `There should be only ${this.options.extraImages.max} extra image${
              this.options.extraImages.max > 1 ? 's' : ''
            }.`,
          );
        }
        for (let image of extra_images) {
          if (image.size > maxSize) {
            throw new Error(errorSizeMessgae);
          }
          const fileType = await fromBuffer(image.buffer);
          if (!validMimes.includes(fileType?.mime ?? '')) {
            throw new Error('Invalid file(s) uploaded');
          }
        }
      }
      return true;
    } catch (error: any) {
      this.errorMessage = error.message;
    }
    return false;
  }

  buildErrorMessage(file: any): string {
    return this.errorMessage;
  }
}
