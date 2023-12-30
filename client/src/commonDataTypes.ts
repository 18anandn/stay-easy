export type SearchInputFields = {
  search: string;
};

export type LatLng = [number, number];

export type RectBounds = [LatLng, LatLng];

export interface LoginCreds {
  email: string;
  password: string;
}

export interface LoginRes {
  userId: string;
  role: string;
}

export class ServerError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
  ) {
    super(message);
    if (!message) {
      this.message = 'There was some error. Please try again.';
    }
  }
}

export type CreateHotelFormData = {
  name: string;
  location: string;
  location_name?: string;
  price: string;
  price_per_guest: string;
  cabin_amount: number;
  cabin_capacity: number;
  amenities?: string[];
  main_image: File[];
  extra_images: File[];
};

export type PresignedPostUrls = {
  url: string;
  keys: string[];
  fields: any;
};

export type Amenity = {
  name: string;
};

export type GeoCodingData = {
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

export const CHECK_IN = 'check-in';
export const CHECK_OUT = 'check-out';
export const GUESTS = 'guests';
export const DATE_FORMAT_NUM = 'yyyy-MM-dd';
export const DATE_FORMAT_TEXT = 'd, LLL y';