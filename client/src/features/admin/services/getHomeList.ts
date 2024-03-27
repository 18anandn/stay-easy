import { Exception } from '../../../data/Exception';
import { tryCatchWrapper } from '../../../utils/tryCatchWrapper';
import { Verification } from './updateHomeData';

export type HomeListParams = {
  verification_status?: Verification;
  page: number;
};

type HomeData = {
  id: string;
  name: string;
  user: string;
  created: string;
};

type HomeListData = {
  homeList: HomeData[];
  count: number;
  items_per_page: number;
  totalPages: number;
};

export const getHomeList = tryCatchWrapper(async (objParams: HomeListParams): Promise<HomeListData> => {
  const res = await fetch(
    `/api/v1/admin/homelist?${objParamsToSearchParams(objParams).toString()}`,
    {
      cache: 'no-cache',
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Exception(
      data.message ?? 'There was an internal server error',
      data.statusCode ?? 500
    );
  }

  data.totalPages = Math.ceil(data.count / data.items_per_page);

  return data;
});

export const searchParamsToObjParams = (
  searchParams: URLSearchParams,
): HomeListParams => {
  const res: HomeListParams = { page: 1 };
  const pageParam = parseInt(searchParams.get('page') ?? '');
  if (Number.isInteger(pageParam)) {
    res.page = pageParam;
  }

  const verificationParam = searchParams.get('verification_status');
  if (
    verificationParam &&
    Object.values(Verification).includes(verificationParam as Verification)
  ) {
    res.verification_status = verificationParam as Verification;
  }

  return res;
};

export const objParamsToSearchParams = ({
  page,
  verification_status,
}: HomeListParams): URLSearchParams => {
  const searchParams = new URLSearchParams();
  if (page) searchParams.set('page', page.toString());
  if (verification_status)
    searchParams.set('verification_status', verification_status);

  return searchParams;
};

export const formKey = ({
  page,
  verification_status,
}: HomeListParams): any[] => {
  const queryKey: any[] = [];
  if (!verification_status) {
    queryKey.push('all');
  } else {
    queryKey.push(verification_status);
  }

  if (page) queryKey.push(page);

  return queryKey;
};
