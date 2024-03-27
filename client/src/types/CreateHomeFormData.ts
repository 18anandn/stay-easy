export type CreateHomeFormData = {
  name: string;
  location: string;
  address: string;
  price: string;
  price_per_guest: string;
  number_of_cabins: number;
  cabin_capacity: number;
  amenities: string[];
  main_image: File[];
  extra_images: File[];
  description: string;
};
