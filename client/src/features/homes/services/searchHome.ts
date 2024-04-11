import { isMatch } from 'date-fns';
import { LatLng, LatLngBounds } from 'leaflet';
import { DATE_FORMAT_NUM } from '../../../data/constants';
import { latlngVerify } from '../../../utils/location/latlngVerify';
import { AMENITIES_LIST } from '../data/amenities';
import { getBbox } from '../../../utils/location/getBbox';
import { SearchHomeListParams } from '../types/SearchHomeListParams';
import {
  SearchHomeListRes,
  SearchHomeListResSchema,
} from '../types/SearchHomeListRes';
import { customFetch } from '../../../utils/customFetch';

export const toSearchHomeURLParams = ({
  address,
  dates,
  distance,
  min,
  max,
  amenities,
  sortBy,
  order,
  page,
}: SearchHomeListParams): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (address.length > 0)
    searchParams.set('address', address.replace(/\s+/g, ' ').trim());
  const [checkIn, checkOut] = dates.split('_');
  if (
    checkIn &&
    checkOut &&
    checkIn.length > 0 &&
    checkOut.length > 0 &&
    isMatch(checkIn, DATE_FORMAT_NUM) &&
    isMatch(checkIn, DATE_FORMAT_NUM)
  ) {
    searchParams.set('dates', dates);
  }
  if (distance.length > 0 && !isNaN(parseInt(distance))) {
    searchParams.set('distance', distance);
  }
  if (min.length > 0 && max.length > 0) {
    if (latlngVerify(min)) searchParams.set('min', min);
    if (latlngVerify(max)) searchParams.set('max', max);
  }
  if (amenities.length > 0) {
    searchParams.set(
      'amenities',
      amenities.join(',')
      // amenities
      //   .trim()
      //   .split(',')
      //   .filter((val) => val.length > 0)
      //   .toString(),
    );
  }
  if (sortBy.length > 0) searchParams.set('sortBy', sortBy);
  if (order.length > 0) searchParams.set('order', order);
  if (page > 1) searchParams.set('page', page.toString());
  return searchParams;
};

export const getFindHomeParams = (
  searchParam: URLSearchParams
): SearchHomeListParams => {
  const address =
    searchParam.get('address')?.replace(/\s+/g, ' ').trim().toLowerCase() ?? '';
  const dates_str = searchParam.get('dates');
  const dates_arr = dates_str?.split('_');
  const dates =
    dates_str &&
    dates_arr &&
    dates_arr[0] &&
    isMatch(dates_arr[0], DATE_FORMAT_NUM) &&
    dates_arr[1] &&
    isMatch(dates_arr[1], DATE_FORMAT_NUM)
      ? dates_str
      : '';
  // const checkOut_str = searchParam.get('checkOut');
  // const checkIn =
  //   checkIn_str && isMatch(checkIn_str, DATE_FORMAT_NUM) ? checkIn_str : '';
  // const checkOut =
  //   checkOut_str && isMatch(checkOut_str, DATE_FORMAT_NUM) ? checkOut_str : '';
  const distance_str = searchParam.get('distance');
  const distance =
    distance_str && distance_str.length > 0 && !isNaN(parseInt(distance_str))
      ? distance_str
      : '';
  const min_str = searchParam.get('min');
  const max_str = searchParam.get('max');
  const min = min_str && latlngVerify(min_str) ? min_str : '';
  const max = max_str && latlngVerify(max_str) ? max_str : '';
  const amenities_str = searchParam.get('amenities');
  const amenities_temp = amenities_str
    ? amenities_str
        .replace(/\s+/g, ' ')
        .trim()
        .split(',')
        .map((val) => val.trim().toLowerCase())
    : undefined;
  const amenities = amenities_temp
    ? AMENITIES_LIST.map((val) => val.toLowerCase())
        .filter((val) => amenities_temp.includes(val))
        .sort()
    : // .join(',')
      [];
  const sortBy = searchParam.get('sortBy') ?? '';
  const order = searchParam.get('order') ?? '';
  const page_str = searchParam.get('page');
  const page_parsed = parseInt(page_str ?? '1');
  const page =
    page_str && page_str.length > 0 && !isNaN(page_parsed) && page_parsed > 1
      ? page_parsed
      : 1;
  const country = searchParam.get('country') ?? '';
  return {
    address,
    country,
    dates,
    // checkIn,
    // checkOut,
    distance,
    min,
    max,
    amenities,
    sortBy,
    order,
    page,
  };
};

export const searchHomeList = async (
  params: SearchHomeListParams
): Promise<SearchHomeListRes> => {
  const searchParams = toSearchHomeURLParams(params);
  if (searchParams.has('min') && searchParams.has('max')) {
    searchParams.delete('address');
  }

  let endPoint = '/api/v1/home/findNearestHomes';
  if (searchParams.has('address')) {
    endPoint = '/api/v1/home/findNearestHomesWithAddress';
  }
  const data = await customFetch(
    `${endPoint}?${searchParams.toString()}`,
    SearchHomeListResSchema,
    {
      errorMessage: 'There was an error while searching',
    }
  );

  const { bounds: oldBounds, homes: oldHomes, ...rest } = data;

  const newHomes = oldHomes.map((val) => {
    const { location, ...restHomeData } = val;
    return {
      ...restHomeData,
      location: new LatLng(location[0], location[1]),
    };
  });

  const queryParams = { ...params };
  let newBounds: LatLngBounds | undefined;
  if (data.bounds) {
    // data.min = data.bounds[0].reverse().join(',');
    // data.max = data.bounds[1].reverse().join(',');
    queryParams.min = data.bounds[0].join(',');
    queryParams.max = data.bounds[1].join(',');
    newBounds = new LatLngBounds(data.bounds[0], data.bounds[1]);
    if (newHomes.length > 1 && params.address.length !== 0) {
      newBounds = getBbox(newHomes.map((val) => val.location));
    }
  }

  return {
    ...rest,
    params: queryParams,
    homes: newHomes,
    bounds: newBounds,
    totalPages: Math.ceil(data.count / data.items_per_page),
  };
};
