import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

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

  async getLocation(address: string) {
    const res = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${address.replace(
        ' ',
        '%20',
      )}&format=json&apiKey=${this.configService.get('GEO_API_KEY')}`,
    );
    const data = await res.json();
    if (!data || !data.results.length) {
      throw new InternalServerErrorException('Geocoding failed');
    }

    return {
      lat: data.results[0].lat,
      lng: data.results[0].lon,
      address: data.results[0].formatted,
      box: data.results[0].bbox
    };
  }
}
