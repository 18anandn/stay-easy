import {
  GeocodingService,
  LocationDetails,
} from './../geocoding/geocoding.service';
import { UploadService } from './../upload/upload.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import path from 'path';

import { Repository, DataSource, ILike } from 'typeorm';
import { S3File } from '../upload/s3file.entity';
import { sleeper } from '../utility/sleeper';
import { parse } from 'csv-parse';
import { Amenity } from '../amenity/amenity.entity';
import { Home } from '../home/home.entity';
import { CurrentUserDto } from '../user/dtos/current-user.dto';
import { Cabin } from '../cabin/cabin.entity';
import { User, UserRole } from '../user/user.entity';
import { Verification } from '../home/verification.enum';
import { Test } from './test.entity';
import {
  addDays,
  differenceInCalendarDays,
  endOfYear,
  startOfYear,
} from 'date-fns';

const PAGE_SIZE = 50;

type CsvData = {
  location: string;
  name: string;
  city: string;
  state: string;
  country: string;
  complete_address: string;
  postcode: string;
  time_zone: string;
  cabin_capacity: string;
  number_of_cabins: string;
  amenities: string;
  description: string;
  images: string[];
  price: string;
  price_per_guest: string;
};

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test) private testRepository: Repository<Test>,
    private geocodingService: GeocodingService,
    private uploadService: UploadService,
    private dataSource: DataSource,
  ) {}

  // async uploadData(user: CurrentUserDto) {
  //   let count = 0;
  //   const arr: Promise<LocationDetails | null>[] = [];
  //   while (count < 1000) {
  //     const curr_count = count.toString();
  //     this.geocodingService
  //       .getLocation('Goa')
  //       .then((data) => {
  //         // console.log(data);
  //         // console.log(curr_count, data);
  //         // console.log('-------------');
  //       })
  //       .catch((err) => {
  //         console.log(curr_count, err);
  //         console.log(Object.keys(err));
  //         console.log(err?.code === 'UND_ERR_CONNECT_TIMEOUT');
  //         console.log(err instanceof TypeError);
  //         console.log('-------------');
  //       });
  //     count++;
  //   }
  //   return { message: 'done' };
  // }

  async uploadData(user: CurrentUserDto) {
    const data = await this.formHomeData();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const all_amenities = await queryRunner.manager
        .getRepository(Amenity)
        .find();
      const homeRepo = queryRunner.manager.getRepository(Home);
      const fileRepo = queryRunner.manager.getRepository(S3File);
      const cabinRepo = queryRunner.manager.getRepository(Cabin);
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const amenities = row.amenities.toLowerCase().split(', ');
        const home = await homeRepo.save(
          homeRepo.create({
            is_sample: true,
            verification_status: Verification.Approved,
            name: row.name,
            price: (parseFloat(row.price) * 105) / 100,
            price_per_guest: (parseFloat(row.price_per_guest) * 105) / 100,
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
            country: row.country,
            address: row.complete_address,
            description: row.description,
            postcode: row.postcode,
            time_zone: row.time_zone,
            owner_id: user.userId,
            number_of_cabins: parseInt(row.number_of_cabins),
            cabin_capacity: parseInt(row.cabin_capacity),
            amenities: all_amenities.filter((amenity) =>
              amenities.includes(amenity.name.toLowerCase()),
            ),
          }),
        );
        const cabins: Cabin[] = [];
        for (let j = 1; j <= home.number_of_cabins; j++) {
          cabins.push(cabinRepo.create({ home_id: home.id, number: j }));
        }
        await cabinRepo.save(cabins);
        await queryRunner.manager
          .getRepository(User)
          .update({ id: user.userId }, { role: UserRole.OWNER });
        home.main_image = await fileRepo.findOneByOrFail({
          object_key: ILike(row.images[0]),
        });
        home.extra_images = await fileRepo.find({
          where: row.images.slice(1).map((val) => {
            return {
              object_key: val,
            };
          }),
        });
        await homeRepo.save(home);
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

  async formHomeData() {
    const cwd = path.join(process.cwd(), 'src', 'test');
    const goa = await new Promise<CsvData[]>((resolve) => {
      const arr: any[] = [];
      fs.createReadStream(path.join(cwd, 'goa.csv'))
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', function (row) {
          arr.push({ ...row, images: row.images.split(',') });
        })
        .on('end', function () {
          resolve(arr);
        });
    });
    const himachal = await new Promise<CsvData[]>((resolve) => {
      const arr: any[] = [];
      fs.createReadStream(path.join(cwd, 'himachal.csv'))
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', function (row) {
          arr.push({ ...row, images: row.images.split(',') });
        })
        .on('end', function () {
          resolve(arr);
        });
    });
    const kerala = await new Promise<CsvData[]>((resolve) => {
      const arr: any[] = [];
      fs.createReadStream(path.join(cwd, 'kerala.csv'))
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', function (row) {
          arr.push({ ...row, images: row.images.split(',') });
        })
        .on('end', function () {
          resolve(arr);
        });
    });
    const norway = await new Promise<CsvData[]>((resolve) => {
      const arr: any[] = [];
      fs.createReadStream(path.join(cwd, 'norway.csv'))
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', function (row) {
          arr.push({ ...row, images: row.images.split(',') });
        })
        .on('end', function () {
          resolve(arr);
        });
    });
    const japan = await new Promise<CsvData[]>((resolve) => {
      const arr: any[] = [];
      fs.createReadStream(path.join(cwd, 'japan.csv'))
        .pipe(parse({ delimiter: ',', columns: true }))
        .on('data', function (row) {
          arr.push({ ...row, images: row.images.split(',') });
        })
        .on('end', function () {
          resolve(arr);
        });
    });
    const data = [...goa, ...himachal, ...kerala, ...norway, ...japan];
    const res: CsvData[] = [];
    while (data.length > 0) {
      res.push(data.splice(Math.floor(Math.random() * data.length), 1)[0]);
    }
    return res;
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

  async createData() {
    const today = new Date();
    const start_of_year = startOfYear(today);
    const end_of_year = endOfYear(today);
    const days_in_year = differenceInCalendarDays(end_of_year, start_of_year);
    const date_range = 60;
    for (let i = 0; i < 10000; i++) {
      const arr: Test[] = [];
      for (let j = 0; j < 1000; j++) {
        const start = addDays(
          start_of_year,
          Math.ceil(Math.random() * days_in_year),
        );
        const end = addDays(start, Math.ceil(Math.random() * date_range));
        arr.push(this.testRepository.create({ start, end }));
      }
      await this.testRepository.save(arr);
      console.log(i);
    }
    return { message: 'success' };
  }

  getFakeData(page: number) {}
  async test1() {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const home = await this.dataSource.query(
        "SELECT * FROM home WHERE id=''",
      );
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
