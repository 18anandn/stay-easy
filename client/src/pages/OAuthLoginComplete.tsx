import { useLayoutEffect } from 'react';
import { AuthMessage } from '../features/auth/enums/AuthMessage.enum';
import { useParams } from 'react-router-dom';

const OAuthLoginComplete: React.FC = () => {
  const { authstatus } = useParams();
  useLayoutEffect(() => {
    const parentWindow: Window | undefined | null = window.opener;
    if (parentWindow) {
      if (authstatus === 'success') {
        parentWindow.postMessage(AuthMessage.SUCCESS, '*');
      } else {
        parentWindow.postMessage(AuthMessage.FAILURE, '*');
      }
      window.close();
    } else {
      window.location.replace('/');
    }
  }, [authstatus]);

  return null;
};

export default OAuthLoginComplete;
