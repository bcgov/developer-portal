import React, { useEffect, useState, PropsWithChildren } from 'react';
import {
  useApi,
  githubAuthApiRef,
  BackstageIdentityResponse,
} from '@backstage/core-plugin-api';
import {
  SignInPage,
  SignInProviderConfig,
  Progress,
} from '@backstage/core-components';
import { useNavigate } from 'react-router-dom';

type ProtectedPageProps = PropsWithChildren & {
  provider: SignInProviderConfig;
  redirect: string;
};

const ProtectedPage = ({
  children,
  provider,
  redirect,
  ...props
}: ProtectedPageProps) => {
  const authApi = useApi(githubAuthApiRef);

  const [isSignedIn, setIsSignedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();

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
    navigate(redirect);
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
