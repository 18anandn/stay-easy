import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Home } from '../home/home.entity';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetHomeListDto } from './dtos/get-home-list.dto';
import { UploadService } from '../upload/upload.service';
import { UpdateHomeDto } from './dtos/update-home.dto';
import { DatabaseError } from 'pg-protocol';
import { VerificationEnum } from '../home/Verification.enum';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Home) private homeRepository: Repository<Home>,
    private dataSource: DataSource,
    private uploadService: UploadService,
  ) {}

  async getHomeList({ verification_status, page }: GetHomeListDto) {
    const items_per_page = 10;
    const current_page = page ?? 1;
    const [homes, count] = await this.homeRepository.findAndCount({
      where: {
        verification_status,
      },
      select: {
        id: true,
        number: true,
        name: true,
        created_date: true,
        owner: {
          first_name: true,
          last_name: true,
        },
      },
      relations: {
        owner: true,
      },
      order: {
        number: 'DESC',
      },
      take: items_per_page,
      skip: (current_page - 1) * items_per_page,
    });
    const homeList = homes.map((home) => {
      return {
        id: home.id,
        name: home.name,
        user: `${home.owner.first_name} ${home.owner.last_name}`,
        created: home.created_date,
      };
    });
    return { homeList, count, items_per_page };
  }

  async getHome(homeId: string) {
    const home = await this.homeRepository.findOne({
      where: { id: homeId },
      select: {
        id: true,
        name: true,
        location: {
          coordinates: true,
        },
        address: true,
        price: true,
        price_per_guest: true,
        number_of_cabins: true,
        cabin_capacity: true,
        amenities: {
          name: true,
        },
        main_image: {
          id: true,
          object_key: true,
        },
        extra_images: {
          id: true,
          object_key: true,
        },
        description: true,
        time_zone: true,
        city: true,
        state: true,
        country: true,
        postcode: true,
        message: true,
        owner: {
          first_name: true,
          last_name: true,
        },
        verification_status: true,
      },
      relations: {
        owner: true,
        main_image: true,
        extra_images: true,
        amenities: true,
      },
    });
    if (!home) {
      throw new NotFoundException(`No home with id: ${homeId}`);
    }

    return {
      ...home,
      location: home.location.coordinates.slice().reverse().join(', '),
      owner: `${home.owner.first_name} ${home.owner.last_name}`,
      main_image: this.uploadService.getPresignedUrl(
        home.main_image.object_key,
      ),
      extra_images: home.extra_images.map((s3file) =>
        this.uploadService.getPresignedUrl(s3file.object_key),
      ),
      amenities: home.amenities.map((val) => val.name),
    };
  }

  async updateHome(
    homeId: string,
    {
      verification_status,
      time_zone,
      city,
      state,
      country,
      postcode,
      message,
    }: UpdateHomeDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const homeRepo = queryRunner.manager.getRepository(Home);
      const home = await homeRepo.findOneBy({ id: homeId });
      if (!home) {
        throw new NotFoundException(`No home with id: ${homeId}`);
      }
      // if()
      switch (verification_status) {
        case VerificationEnum.Approved:
          if (time_zone && city && state && country && postcode) {
            home.verification_status = VerificationEnum.Approved;
            home.time_zone = time_zone;
            home.city = city;
            home.state = state;
            home.country = country;
            home.postcode = postcode;
          } else {
            throw new BadRequestException(
              'Approval failed as missing data to update',
            );
          }
          break;
        case VerificationEnum.Rejected:
          if (message) {
            home.verification_status = VerificationEnum.Rejected;
            home.message = message;
          } else {
            throw new BadRequestException('Cannot reject without message');
          }
          break;
        default:
          throw new BadRequestException(
            'Cannot update data with pending status',
          );
      }
      await homeRepo.save(home);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) {
        throw error;
      }
      if (
        error instanceof QueryFailedError &&
        error.driverError instanceof DatabaseError
      ) {
        console.log(error);
        throw new BadRequestException('Invalid data submitted');
      }
      throw new InternalServerErrorException('An unexpected error occured');
    } finally {
      await queryRunner.release();
    }
  }
}
