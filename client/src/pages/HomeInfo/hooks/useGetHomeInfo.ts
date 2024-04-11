import { useParams } from 'react-router-dom';
import useGetHome from '../../../features/homes/hooks/useGetHome';

export const useGetHomeInfo = () => {
  const { homeId } = useParams();
  
  return { homeId, ...useGetHome(homeId) };
};
