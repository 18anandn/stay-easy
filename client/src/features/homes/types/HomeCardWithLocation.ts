import { HomeCardInfo } from './HomeCardInfo';

export type HomeCardWithLocation = {
  location: [number, number];
} & HomeCardInfo;
