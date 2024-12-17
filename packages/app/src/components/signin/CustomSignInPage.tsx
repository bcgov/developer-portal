import {
  SignInPageProps,
  useApi,
  githubAuthApiRef,
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

export type Props = SignInPageProps & {
  provider: SignInProviderConfig;
};

export const CustomSignInPage = (props: Props) => {
  const authApi = useApi(githubAuthApiRef);
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
          // show login page if they go to a location that isn't the main page or a page in techdocs
          setShowLoginPage(
            location.pathname !== '/' && !location.pathname.startsWith('/docs'),
          );
          return;
        }
        // logged in with GitHub, so carry on to SignIn page which will pass the login and not show signinpage
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
