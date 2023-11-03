export type TestData = {
  id: string;
  city: string;
  country: string;
  street_address: string;
  description: string;
};

export const getFakeData = async (page: number): Promise<TestData> => {
  console.log(page);
  const res = await fetch('/api/v1/test/fakeData?page=' + page, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-cache',
  });

  const data = await res.json();
  return data;
};
