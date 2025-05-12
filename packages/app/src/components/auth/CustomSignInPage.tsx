import { SignInPageProps, useApi } from '@backstage/core-plugin-api';
import {
  ProxiedSignInPage,
  SignInPage,
  SignInProviderConfig,
  Progress,
} from '@backstage/core-components';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getIdentityResponse, isProtected } from './helpers';

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
        const identityResponse = await getIdentityResponse(authApi);

        if (!identityResponse) {
          /*
          Not logged in with GitHub or as the guest user
          If they are going to a protected page then they need to SignIn with GitHub.
          Otherwise, they will be automatically logged in as guest user via the ProxiedSignInPage, which is a 
          hack to allow our public pages to be accessed without a GitHub login.
          */
          setShowLoginPage(isProtected(location));
        } else {
          // They are logged in as either Guest or with GitHub account. The SigInPage will handle what to do
          // (either show the login page or not).
          setShowLoginPage(true);
        }
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
