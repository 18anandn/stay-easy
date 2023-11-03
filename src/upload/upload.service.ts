import { ConfigService } from '@nestjs/config';
import { BadRequestException, Injectable } from '@nestjs/common';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl } from '@aws-sdk/cloudfront-signer';
import {
  CopyObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { isInt } from 'class-validator';
import { S3File } from './s3file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomError } from '../errors/CustomError';
import { fromBuffer } from 'file-type';

enum ValidExtensions {
  PNG = 'png',
  JPG = 'jpg',
  JPEG = 'jpeg',
}

// const SIZE_LIMIT = 5 * 1048576;
const SIZE_LIMIT = 300 * 1024;
const KEYS_LIMIT = 6;
const POST_EXPIRY_PERIOD = 300;
const GET_EXPIRY_PERIOD = 2 * 60 * 60 * 1000;
const VALID_EXTENSIONS: string[] = Object.values(ValidExtensions);
const JPEG_NUMBER = 'ffd8ff';
const PNG_NUMBER = '89504e47';
const WEBP_NUMBER = ['52494646', '57454250'];

@Injectable()
export class UploadService {
  private readonly client: S3Client;
  private readonly bucket_name: string;
  private readonly cloudfront_domain: string;
  private readonly cloudfront_keypair_id: string;
  private readonly cloudfront_private_key: string;

  constructor(
    private configService: ConfigService,
    @InjectRepository(S3File) private fileRepository: Repository<S3File>,
  ) {
    this.bucket_name = this.configService.get('AWS_BUCKET');
    let params: S3ClientConfig = {
      region: this.configService.get('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    };
    // if (this.configService.get('NODE_ENV') === 'development') {
    //   params = {
    //     ...params,
    //     endpoint: 'http://localhost:9000',
    //     forcePathStyle: true,
    //     credentials: {
    //       accessKeyId: this.configService.get('DEV_MINIO_ACCESS_KEY_ID'),
    //       secretAccessKey: this.configService.get(
    //         'DEV_MINIO_SECRET_ACCESS_KEY',
    //       ),
    //     },
    //   };
    // }
    this.client = new S3Client(params);
    this.cloudfront_domain = this.configService.get('CLOUDFRONT_DOMAIN');
    this.cloudfront_keypair_id = this.configService.get(
      'CLOUDFRONT_KEYPAIR_ID',
    );
    this.cloudfront_private_key = this.configService.get(
      'CLOUDFRONT_PRIVATE_KEY',
    );
  }

  async getPresignedpost(number_of_keys: number, user: CurrentUserDto) {
    if (!isInt(number_of_keys)) {
      throw new BadRequestException('Send valid number of required urls');
    }
    if (number_of_keys > KEYS_LIMIT) {
      throw new BadRequestException(`Cannot send more than ${KEYS_LIMIT} urls`);
    }
    if (number_of_keys < 1) {
      throw new BadRequestException('Send valid number of required urls');
    }
    const Prefix_Key = `request/${user.userId}/${Date.now()}/`;
    const keys: string[] = [];
    for (let i = 0; i < number_of_keys; i++) {
      keys.push(`${Prefix_Key}${crypto.randomBytes(20).toString('hex')}`);
    }
    const { url, fields } = await createPresignedPost(this.client, {
      Bucket: this.bucket_name,
      Key: Prefix_Key + '${filename}',
      Expires: POST_EXPIRY_PERIOD,
      Conditions: [
        ['starts-with', '$Content-Type', 'image/'],
        ['content-length-range', 0, SIZE_LIMIT],
        ['starts-with', '$key', Prefix_Key],
      ],
    });
    return { url, keys, fields };
  }

  private async getObjectBytes(Key: string) {
    try {
      const res = await this.client.send(
        new GetObjectCommand({
          Bucket: this.bucket_name,
          Key,
          Range: 'bytes=0-11',
        }),
      );
      const uint8 = await res.Body.transformToByteArray();
      const hex = Buffer.from(uint8).toString('hex');
      return { hex, contentType: res.ContentType };
    } catch (error) {
      throw new CustomError('file', `No object with key: ${Key}`);
    }
  }

  private async verifyFile(key: string) {
    if (!key.startsWith('request/')) {
      throw new CustomError('file', 'Invalid url sent');
    }
    const { hex: bytes } = await this.getObjectBytes(key);
    if (
      !(
        // bytes.startsWith(JPEG_NUMBER) ||
        // bytes.startsWith(PNG_NUMBER) ||
        (bytes.startsWith(WEBP_NUMBER[0]) && bytes.endsWith(WEBP_NUMBER[1]))
      )
    ) {
      throw new CustomError('file', 'Invalid file uploaded');
    }
    // const arr = key.split('.');
    // if (arr.length < 2) {
    //   throw new CustomError('file', 'No extension');
    // }
    // const extension = arr.at(-1);
    // if (!VALID_EXTENSIONS.includes(extension)) {
    //   throw new CustomError('file', 'Invalid extension');
    // }
    // if (
    //   extension === ValidExtensions.JPEG ||
    //   extension === ValidExtensions.JPG
    // ) {
    //   if (bytes !== JPEG_NUMBER) {
    //     throw new CustomError('file', 'Manipulated file');
    //   }
    // } else if (extension === ValidExtensions.PNG) {
    //   if (bytes !== PNG_NUMBER) {
    //     throw new CustomError('file', 'Manipulated file');
    //   }
    // }
  }

  private async createFile(key: string, user: CurrentUserDto) {
    const arr = key.split('/');
    if (arr.length < 2) {
      throw new CustomError('file', 'Invalid url sent');
    }
    if (arr.at(1) !== user.userId) {
      throw new CustomError('file', 'User not matching');
    }
    arr.shift();
    try {
      const newKey = arr.join('/');
      const res = await this.client.send(
        new CopyObjectCommand({
          Bucket: this.bucket_name,
          CopySource: `/${this.bucket_name}/${key}`,
          Key: newKey,
        }),
      );
      return newKey;
    } catch (error) {
      throw new CustomError('file', `Copy error with key ${key}`);
    }
  }

  async getFiles(keys: string[], user: CurrentUserDto) {
    await Promise.all(keys.map((key) => this.verifyFile(key)));
    const fileNames = await Promise.all(
      keys.map((key) => this.createFile(key, user)),
    );
    const files = await this.fileRepository.save(
      fileNames.map((val) => {
        return this.fileRepository.create({ object_key: val });
      }),
    );
    return files;
  }

  getPresignedUrl(key: string) {
    return getSignedUrl({
      url: `${this.cloudfront_domain}/${key}`,
      dateLessThan: new Date(Date.now() + GET_EXPIRY_PERIOD).toISOString(),
      keyPairId: this.cloudfront_keypair_id,
      privateKey: this.cloudfront_private_key,
    });
  }

  async uploadImage(Key: string, image: Buffer) {
    return this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket_name,
        Key,
        Body: image,
        ContentType: (await fromBuffer(image)).mime,
      }),
    );
  }
}
