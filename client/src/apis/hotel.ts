// import { EImageType, compressAccurately } from 'image-conversion';
import imageCompression from 'browser-image-compression';

import {
  CreateHotelFormData,
  PresignedPostUrls,
  ServerError,
} from '../commonDataTypes';

const MAX_IMAGE_SIZE_KB = 200;
const MAX_IMAGE_SIZE = MAX_IMAGE_SIZE_KB * 1024;
const MAX_IMAGE_SIZE_MB = MAX_IMAGE_SIZE_KB / 1024;

export const compressImages = async (images: File[]): Promise<File[]> => {
  const arr: File[] = [];
  for (let image of images) {
    if (image.size <= MAX_IMAGE_SIZE) {
      arr.push(
        await imageCompression(image, {
          maxIteration: 1,
          maxSizeMB: image.size,
          fileType: 'image/webp',
        }),
      );
    } else {
      const compImage = await imageCompression(image, {
        maxIteration: 100,
        maxSizeMB: MAX_IMAGE_SIZE_MB,
        useWebWorker: true,
        fileType: 'image/webp',
      });
      if (compImage.size > MAX_IMAGE_SIZE) {
        throw new ServerError('Unable to compress images', 400);
      }
      arr.push(compImage);
    }
  }
  return arr;
};

const uploadFile = async (
  url: string,
  name: string,
  fields: any,
  file: File,
) => {
  let form = new FormData();
  fields['key'] = name;
  fields['Content-Type'] = file.type;
  Object.keys(fields).forEach((key) => {
    form.append(key, fields[key]);
  });
  form.append('file', file);

  // console.log(name);
  console.log(file.size);
  // console.log(file.type);

  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new ServerError('There was an error uploading the file', res.status);
  }
  return res;
};

export const uploadImages = async (images: File[]): Promise<string[]> => {
  const res = await fetch(`/api/v1/hotel/upload/${images.length}`, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
  });

  const data = await res.json();
  // console.log(data);

  if (!res.ok) {
    throw new ServerError(data.message, res.status);
  }

  const { url, keys, fields }: PresignedPostUrls = data;
  const names = keys;
  // const names = keys.map((val, i) => {
  //   const arr = images[i].name.split('.');
  //   if (arr.length < 2) {
  //     throw new ServerError('No extension on file', 400);
  //   }
  //   return `${val}.${arr.at(-1)}`;
  // });

  const uploads: Promise<any>[] = [];
  for (let i = 0; i < images.length; i++) {
    uploads.push(uploadFile(url, names[i], fields, images[i]));
  }
  await Promise.all(uploads);

  return names;
};

export const createHotel = async (
  hotelData: CreateHotelFormData,
  images: string[],
) => {
  const { main_image, extra_images, ...requestBody } = hotelData;
  console.log(requestBody);
  const res2 = await fetch('/api/v1/hotel/create', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify({ ...requestBody, images }),
  });

  const data2 = await res2.json();
  if (!res2.ok) {
    throw new ServerError(data2.message, res2.status);
  }
};

export type HotelInfo = {
  id: string;
  name: string;
  price: number;
  cabin_capacity: number;
  city: string;
  state: string;
  country: string;
  complete_address: string;
  main_image: string;
  amenities: string[];
};

export const getHotels = async (page: number): Promise<HotelInfo> => {
  // console.log(page);
  const res = await fetch(`api/v1/hotel?page=${page}`, {
    method: 'GET',
    cache: 'no-cache',
    mode: 'cors',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ServerError(data.message, res.status);
  }

  return data;
};
