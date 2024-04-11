import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ResetScrollOnPathChange: React.FC = () => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

export default ResetScrollOnPathChange;
