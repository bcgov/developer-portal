import React, { useEffect, useState, PropsWithChildren } from 'react';
import { useApi, BackstageIdentityResponse } from '@backstage/core-plugin-api';
import {
  SignInPage,
  SignInProviderConfig,
  Progress,
} from '@backstage/core-components';
import { useLocation, useNavigate } from 'react-router-dom';

type ProtectedPageProps = PropsWithChildren & {
  provider: SignInProviderConfig;
};

const ProtectedPage = ({
  children,
  provider,
  ...props
}: ProtectedPageProps) => {
  const authApi = useApi(provider.apiRef);

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkSignInStatus = async () => {
      try {
        const identityResponse: BackstageIdentityResponse | undefined =
          await authApi.getBackstageIdentity({
            optional: true,
            instantPopup: false,
          });

        setIsSignedIn(!!identityResponse);
      } catch (error) {
        setIsSignedIn(false);
      }
    };

    checkSignInStatus();
  }, [authApi]);

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
    navigate(location.pathname);
    window.location.reload(); // hack to get identity to reload
  };

  if (isSignedIn === null) {
    return <Progress />;
  }

  if (!isSignedIn) {
    return (
      <SignInPage
        {...props}
        auto={false}
        provider={provider}
        onSignInSuccess={handleSignInSuccess}
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedPage;
