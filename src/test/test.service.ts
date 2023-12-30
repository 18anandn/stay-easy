import { UploadService } from './../upload/upload.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { Test } from './test.entity';
import { Repository, DataSource, ILike } from 'typeorm';
import { S3File } from '../upload/s3file.entity';
import { sleeper } from '../utility/sleeper';
import { parse } from 'csv-parse';
import arrayShuffle from 'array-shuffle';
import { Amenity } from '../amenity/amenity.entity';
import { countVariation, sampler } from '../utility/sampler';
import { Hotel } from '../hotel/hotel.entity';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { Cabin } from '../cabin/cabin.entity';
import { User, UserRole } from '../user/user.entity';

const PAGE_SIZE = 50;

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test) private testRepository: Repository<Test>,
    private uploadService: UploadService,
    private dataSource: DataSource,
  ) {}

  async uploadData(user: CurrentUserDto) {
    const cwd = path.join(process.cwd(), 'src', 'test');
    const filePath = path.join(cwd, 'hotel_data.csv');
    type CsvData = {
      location: string;
      name: string;
      city: string;
      state: string;
      complete_address: string;
      cabin_capacity: string;
      cabin_amount: string;
      images: string[];
      price: string;
      price_per_guest: string;
    };
    const data = await new Promise<CsvData[]>((resolve) => {
      const arr: any[] = [];
      fs.createReadStream(filePath)
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', function (row) {
          arr.push({ ...row, images: row.images.split(',') });
        })
        .on('end', function () {
          resolve(arr);
        });
    });
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const amenities = await queryRunner.manager.getRepository(Amenity).find();
      const sample = sampler(amenities, Math.ceil(amenities.length / 2), 10);
      const hotelRepo = queryRunner.manager.getRepository(Hotel);
      const fileRepo = queryRunner.manager.getRepository(S3File);
      const cabinRepo = queryRunner.manager.getRepository(Cabin);
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const hotel = await hotelRepo.save(
          hotelRepo.create({
            is_sample: true,
            name: row.name,
            price: parseFloat(row.price)*1.05,
            price_per_guest: parseFloat(row.price_per_guest)*1.05,
            location: {
              type: 'Point',
              coordinates: row.location
                .replace(' ', '')
                .split(',')
                .reverse()
                .map((val) => parseFloat(val)),
            },
            city: row.city,
            state: row.state,
            country: 'India',
            complete_address: row.complete_address,
            owner_id: user.userId,
            cabin_amount: parseInt(row.cabin_amount),
            cabin_capacity: parseInt(row.cabin_capacity),
            amenities: sample[i],
          }),
        );
        const cabins = cabinRepo.create(
          Array(hotel.cabin_amount).fill({
            hotel_id: hotel.id,
            cabin_capacity: hotel.cabin_capacity,
          }),
        );
        await cabinRepo.save(cabins);
        await queryRunner.manager
          .getRepository(User)
          .update({ id: user.userId }, { role: UserRole.OWNER });
        hotel.main_image = await fileRepo.findOneByOrFail({
          object_key: ILike(row.images[0]),
        });
        hotel.extra_images = await fileRepo.find({
          where: row.images.slice(1).map((val) => {
            return {
              object_key: ILike(val),
            };
          }),
        });
        await hotelRepo.save(hotel);
      }
      await queryRunner.commitTransaction();
      return { data };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.log(error);
      throw new InternalServerErrorException();
    } finally {
      await queryRunner.release();
    }
  }

  async updateFilesTable() {
    const cwd = path.join(process.cwd(), 'src', 'test');
    const villas_path = path.join(cwd, 'compressedImages', 'villas');
    const bedrooms_path = path.join(cwd, 'compressedImages', 'bedrooms');
    const villas = fs.readdirSync(villas_path);
    const bedrooms = fs.readdirSync(bedrooms_path);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const fileRepo = queryRunner.manager.getRepository(S3File);
      for (let villa of villas) {
        const s3File = await fileRepo.save(
          fileRepo.create({ object_key: `sample/villas/${villa}` }),
        );
        console.log(s3File);
      }
      for (let bedroom of bedrooms) {
        const s3File = await fileRepo.save(
          fileRepo.create({ object_key: `sample/bedrooms/${bedroom}` }),
        );
        console.log(s3File);
      }
      await queryRunner.commitTransaction();
      return { message: 'success' };
    } catch (error) {
      console.log(error);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Error');
    } finally {
      await queryRunner.release();
    }
  }

  async uploadFiles() {
    const cwd = path.join(process.cwd(), 'src', 'test');
    const villas_path = path.join(cwd, 'compressedImages', 'villas');
    const bedrooms_path = path.join(cwd, 'compressedImages', 'bedrooms');
    const villas = fs.readdirSync(villas_path);
    const bedrooms = fs.readdirSync(bedrooms_path);
    for (let villa of villas) {
      const image = fs.readFileSync(path.join(villas_path, villa));
      const res = await this.uploadService.uploadImage(
        `sample/villas/${villa}`,
        image,
      );
      console.log('villa: ', res);
    }
    for (let bedroom of bedrooms) {
      const image = fs.readFileSync(path.join(bedrooms_path, bedroom));
      const res = await this.uploadService.uploadImage(
        `sample/bedrooms/${bedroom}`,
        image,
      );
      console.log('bedroom:', res);
    }
    return { message: 'success' };
  }

  createData() {
    const fakeData: Partial<Test>[] = [];
    for (let i = 0; i < 500; i++) {
      fakeData.push(
        this.testRepository.create({
          city: faker.location.city(),
          country: faker.location.country(),
          street_address: faker.location.streetAddress({
            useFullAddress: true,
          }),
          description: faker.lorem.lines(4),
        }),
      );
    }
    return this.testRepository.save(fakeData);
  }

  getFakeData(page: number) {
    return this.testRepository.find({
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    });
  }
}
