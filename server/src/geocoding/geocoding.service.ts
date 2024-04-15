import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GeocodingApiKey } from './geocoding-api-key.entity';
import { Repository, DataSource, QueryFailedError } from 'typeorm';
import { DatabaseError } from 'pg-protocol';
import { Cron } from '@nestjs/schedule';

export type LocationDetails = {
  lat: number;
  lng: number;
  address: string;
  country: string;
  box: {
    lon1: number;
    lat1: number;
    lon2: number;
    lat2: number;
  };
};

@Injectable()
export class GeocodingService {
  readonly allowed_types = ['country', 'state', 'city'];
  readonly apiKeyList: string[] = [];
  curr_key: number = 1;
  constructor(
    private configService: ConfigService,
    @InjectRepository(GeocodingApiKey)
    private geocodingApiKeyRepository: Repository<GeocodingApiKey>,
    private dataSource: DataSource,
  ) {
    const apiKeys: string = this.configService.getOrThrow('GEO_API_KEYS');
    this.apiKeyList = apiKeys.split(',');
  }

  async addKeys() {
    const curr_apiKeyList: GeocodingApiKey[] = [];
    for (let i = 1; i <= this.apiKeyList.length; i++) {
      curr_apiKeyList.push(
        this.geocodingApiKeyRepository.create({ key_num: i }),
      );
    }

    const savedKeyList =
      await this.geocodingApiKeyRepository.save(curr_apiKeyList);

    return savedKeyList;
  }

  @Cron('00 00 * * *')
  resetCurrentKey() {
    this.curr_key = 1;
  }

  async getLocation(address: string): Promise<LocationDetails | null> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      for (let i = this.curr_key; i <= this.apiKeyList.length; i++) {
        await queryRunner.startTransaction();
        try {
          const repo = queryRunner.manager.getRepository(GeocodingApiKey);

          // const temp = await repo.findOneBy({ key_num: i });

          const updatedKey = await repo
            .createQueryBuilder('geocoding_api_key')
            .update(GeocodingApiKey)
            .where('geocoding_api_key.key_num = :num', { num: i })
            .set({ calls: () => 'calls+1' })
            .returning('*')
            .updateEntity(true)
            .execute();

          await queryRunner.commitTransaction();
          const searchParam = new URLSearchParams();
          searchParam.set('text', address);
          searchParam.set('type', 'locality');
          searchParam.set('format', 'json');
          searchParam.set('apiKey', this.apiKeyList[i - 1]);
          const res = await fetch(
            `https://api.geoapify.com/v1/geocode/search?${searchParam.toString()}`,
          );
          let data = await res.json();
          if (!data || !data.results || data.results.length === 0) {
            return null;
          }

          const result: LocationDetails = {
            lat: data.results[0].lat,
            lng: data.results[0].lon,
            address: data.results[0].formatted,
            country: data.results[0].country,
            box: data.results[0].bbox,
          };

          if (!result.lat || !result.lng || !result.address || !result.box) {
            return null;
          }

          return result;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          if (
            error instanceof QueryFailedError &&
            error.driverError instanceof DatabaseError &&
            error.driverError.constraint === 'max_calls'
          ) {
            console.log('skipped');
            this.curr_key++;
            continue;
          }
          throw error;
        }
      }

      throw new ServiceUnavailableException(
        'Third party geocoding service is unavailable for today due to exceeded limit.\n Please try moving around the map for searching.',
      );
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'There was an unknown error while searching',
      );
    } finally {
      await queryRunner.release();
    }
  }
}
