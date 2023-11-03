import { UploadService } from './../upload/upload.service';
import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import { InjectRepository } from '@nestjs/typeorm';
import fs from 'fs';
import path from 'path';

import { Test } from './test.entity';
import { Repository } from 'typeorm';

const PAGE_SIZE = 50;

@Injectable()
export class TestService {
  constructor(
    @InjectRepository(Test) private testRepository: Repository<Test>,
    private uploadService: UploadService,
  ) {}

  async uploadData() {
    const cwd = path.join(process.cwd(), 'src', 'test')
    // const villas_path = path.join(cwd, 'compressedImages', 'villas');
    const bedrooms_path = path.join(
      cwd,
      'compressedImages',
      'bedrooms',
    );
    // const villas = fs.readdirSync(villas_path);
    const bedrooms = fs.readdirSync(bedrooms_path);
    // for (let villa of villas) {
    //   const image = fs.readFileSync(path.join(villas_path, villa));
    //   const res = await this.uploadService.uploadImage(
    //     `sample/villas/${villa}`,
    //     image,
    //   );
    //   console.log('villa: ', res);
    // }
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
