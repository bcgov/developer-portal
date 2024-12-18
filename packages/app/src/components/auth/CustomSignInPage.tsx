import {
  SignInPageProps,
  useApi,
  BackstageIdentityResponse,
} from '@backstage/core-plugin-api';
import {
  ProxiedSignInPage,
  SignInPage,
  SignInProviderConfig,
  Progress,
} from '@backstage/core-components';
import { useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { protectedRoutes } from '../utils/routes';
import { Location } from 'react-router-dom';

export const isProtected = (location: Location) => {
  const regex = /\/[^/?]*/i;
  return protectedRoutes.some(
    route => route.path === (location.pathname.match(regex)?.[0] ?? ''),
  );
};

export type Props = SignInPageProps & {
  provider: SignInProviderConfig;
};

export const CustomSignInPage = (props: Props) => {
  const authApi = useApi(props.provider.apiRef);
  const location = useLocation();

  const [showLoginPage, setShowLoginPage] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSignInStatus = async () => {
      try {
        const identityResponse: BackstageIdentityResponse | undefined =
          await authApi.getBackstageIdentity({
            optional: true,
            instantPopup: false,
          });

        if (!identityResponse) {
          // show login page if they go to a protected location
          setShowLoginPage(isProtected(location));
          return;
        }
        // logged in with provider, so carry on to SignIn page which will pass the login and not show signinpage
        setShowLoginPage(true);
      } catch (err: any) {
        setShowLoginPage(true);
        throw err;
      }
    };
    checkSignInStatus();
  }, [authApi, location]);

  if (showLoginPage === null) {
    return <Progress />;
  }

  return showLoginPage ? (
    <SignInPage {...props} auto={false} provider={props.provider} />
  ) : (
    <ProxiedSignInPage {...props} provider="guest" />
  );
};
