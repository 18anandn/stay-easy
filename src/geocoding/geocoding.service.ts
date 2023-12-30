import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

export type LocationDetails = {
  lat: number;
  lng: number;
  address: string;
  box: {
    lon1: number;
    lat1: number;
    lon2: number;
    lat2: number;
  };
};

@Injectable()
export class GeocodingService {
  constructor(private configService: ConfigService) {}

  async getAddress(lat: number, lng: number) {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${this.configService.get(
        'GEO_API_KEY',
      )}`,
    );
    const data = await res.json();
    if (!data || !data.results.length) {
      throw new InternalServerErrorException('Geocoding failed');
    }

    return data.results[0];
  }

  async getLocation(address: string): Promise<LocationDetails> {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${address.replace(
        ' ',
        '%20',
      )}&format=json&apiKey=${this.configService.get('GEO_API_KEY')}`,
    );
    let data = await res.json();
    if (!data || !data.results.length) {
      throw new InternalServerErrorException('No data found');
    }

    data.results = data.results.filter(
      (location) => (location.country as string).toLowerCase() === 'india',
    );

    if (!data.results.length) {
      throw new InternalServerErrorException('Location outside service bounds');
    }

    return {
      lat: data.results[0].lat,
      lng: data.results[0].lon,
      address: data.results[0].formatted,
      box: data.results[0].bbox,
    };
  }
}
