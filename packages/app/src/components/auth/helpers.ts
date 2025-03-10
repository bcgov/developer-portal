import {
  BackstageIdentityApi,
  BackstageIdentityResponse,
} from '@backstage/core-plugin-api';
import { protectedRoutes } from '../utils/routes';
import { Location } from 'react-router-dom';

export const getIdentityResponse = async (
  authApi: BackstageIdentityApi,
): Promise<BackstageIdentityResponse | undefined> => {
  return authApi.getBackstageIdentity({
    optional: true,
    instantPopup: false,
  });
};

export const isProtected = (location: Location) => {
  const regex = /\/[^/?]*/i;
  return protectedRoutes.some(
    route => route.path === (location.pathname.match(regex)?.[0] ?? ''),
  );
};
