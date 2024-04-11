import { Exception } from '../../../data/Exception';
import { CreateHomeFormData } from '../../../types/CreateHomeFormData';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';
import { UpdatedHomeData } from './updateHomeData';

export type HomeFormData = {
  owner: string;
  main_image: string;
  extra_images: string[];
} & UpdatedHomeData &
  Omit<CreateHomeFormData, 'main_image' | 'extra_images'>;

export const getHomeData = tryCatchWrapper(
  async (homeId: string): Promise<HomeFormData> => {
    const res = await fetch(`/api/v1/admin/home/${homeId}`, {
      cache: 'no-cache',
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Exception(
        data.message ?? 'There was an error',
        data.statusCode ?? 500
      );
    }

    return data;
  }
);
