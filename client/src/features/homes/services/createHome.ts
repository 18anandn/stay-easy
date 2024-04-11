import { Exception } from '../../../data/Exception';
import { CreateHomeFormData } from '../../../types/CreateHomeFormData';

export const createHome = async (
  hotelData: CreateHomeFormData,
  images: string[]
) => {
  const { main_image, extra_images, ...requestBody } = hotelData;
  const res2 = await fetch('/api/v1/home/create', {
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
    throw new Exception(data2.message, res2.status);
  }
};

const uploadFile = async (
  url: string,
  name: string,
  fields: any,
  file: File
) => {
  let form = new FormData();
  fields['key'] = name;
  fields['Content-Type'] = file.type;
  Object.keys(fields).forEach((key) => {
    form.append(key, fields[key]);
  });
  form.append('file', file);

  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    throw new Exception('There was an error uploading the file', res.status);
  }
  return res;
};

type PresignedPostUrls = {
  url: string;
  // keys: string[];
  prefix: string;
  fields: any;
};

export const uploadImages = async (images: File[]): Promise<string[]> => {
  const res = await fetch(`/api/v1/home/upload/${images.length}`, {
    mode: 'cors',
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Exception(data.message, res.status);
  }

  const { url, prefix, fields }: PresignedPostUrls = data;
  const names = images.map((val) => prefix + val.name);
  for (let i = 0; i < images.length; i++) {
    await uploadFile(url, names[i], fields, images[i]);
    await new Promise((resolve) => setTimeout(() => resolve(null), 500));
  }

  return names;
};
