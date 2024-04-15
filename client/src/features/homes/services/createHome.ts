import { CreateHomeFormData } from './../../../types/CreateHomeFormData';
import { Exception } from '../../../data/Exception';

export const createHome = async (
  hotelData: CreateHomeFormData,
  images: string[]
) => {
  const { main_image, extra_images, ...requestBody } = hotelData;
  const res2 = await fetch('/api/v1/home/create', {
    mode: 'cors',
    method: 'POST',
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

export const verifyCreateHomeData = async ({
  main_image,
  extra_images,
  ...requestBody
}: CreateHomeFormData): Promise<PresignedPostUrls> => {
  const urls = extra_images.length + 1;
  const res = await fetch(`/api/v1/home/create/verify/${urls}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    cache: 'no-cache',
    body: JSON.stringify({ ...requestBody }),
  });
  const data = await res.json();

  if (!res.ok) {
    throw new Exception(
      data?.message ?? 'There was an error verifying your home data',
      res.status
    );
  }

  return data;
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

export const uploadImages = async (
  images: File[],
  uploadUrlData: PresignedPostUrls
): Promise<string[]> => {
  const { url, prefix, fields }: PresignedPostUrls = uploadUrlData;
  const names = images.map((val) => prefix + val.name);
  for (let i = 0; i < images.length; i++) {
    await uploadFile(url, names[i], fields, images[i]);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  return names;
};
