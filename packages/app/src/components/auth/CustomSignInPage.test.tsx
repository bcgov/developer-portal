import React from 'react';
import { waitFor } from '@testing-library/react';
import {
  TestApiRegistry,
  mockApis,
  registerMswTestHooks,
  renderInTestApp,
} from '@backstage/test-utils';
import { CustomSignInPage } from './CustomSignInPage';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import {
  configApiRef,
  discoveryApiRef,
  githubAuthApiRef,
} from '@backstage/core-plugin-api';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

const mockUseLocation = useLocation as jest.MockedFunction<typeof useLocation>;

const defaultUseLocationResult = {
  pathname: '',
  search: '',
  state: {},
  hash: '',
  key: '',
};

const mockNoIdentityAuthApi = {
  getBackstageIdentity: jest.fn().mockResolvedValue(undefined),
};

describe('CustomSignInPage Tests', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  const createMockConfig = () =>
    new ConfigReader({
      app: {
        title: 'Unit Test',
        baseUrl: 'http://localhost:3000',
      },
      backend: {
        baseUrl: 'http://localhost:7007',
      },
    });

  const github_auth_provider = {
    id: 'github-auth-provider',
    title: 'GitHub',
    message: 'Sign in using GitHub',
    apiRef: githubAuthApiRef,
  };

  const mswServer = setupServer();
  registerMswTestHooks(mswServer);

  it('should prompt for login to protected path when not logged in', async () => {
    mockUseLocation.mockReturnValue({
      ...defaultUseLocationResult,
      pathname: '/create',
    });

    const mockConfig = createMockConfig();

    const apiRegistry = TestApiRegistry.from(
      [configApiRef, mockConfig],
      [githubAuthApiRef, mockNoIdentityAuthApi],
    );

    const rendered = await renderInTestApp(<div>test</div>, {
      components: {
        SignInPage: props => (
          <ApiProvider apis={apiRegistry}>
            <CustomSignInPage provider={github_auth_provider} {...props} />
          </ApiProvider>
        ),
      },
    });

    await waitFor(() => {
      expect(rendered.queryByRole('progressbar')).not.toBeInTheDocument();
    });
    // screen.debug();
    expect(
      await rendered.findByRole('button', { name: /Sign In/i }),
    ).toBeInTheDocument();
    expect(rendered.queryByText('test')).not.toBeInTheDocument();
  });

  it('should allow access to non protected paths when not logged in', async () => {
    const DISCOVERY_BASE_URL = 'http://example.com';
    // needed for ProxiedSignInPage
    mswServer.use(
      rest.get(
        `${DISCOVERY_BASE_URL}/api/auth/guest/refresh`,
        (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({
              profile: { displayName: 'Guest User' },
              backstageIdentity: {
                token: 'a.e30.c',
                identity: {
                  type: 'user',
                  userEntityRef: 'user:default/guest',
                  ownershipEntityRefs: ['user:default/guest'],
                },
              },
            }),
          );
        },
      ),
    );
    mockUseLocation.mockReturnValue({
      ...defaultUseLocationResult,
      pathname: '/docs',
    });

    const mockConfig = createMockConfig();
    const apiRegistry = TestApiRegistry.from(
      [configApiRef, mockConfig],
      [githubAuthApiRef, mockNoIdentityAuthApi],
      [discoveryApiRef, mockApis.discovery({ baseUrl: DISCOVERY_BASE_URL })],
    );

    const rendered = await renderInTestApp(<div>guest</div>, {
      components: {
        SignInPage: props => (
          <ApiProvider apis={apiRegistry}>
            <CustomSignInPage provider={github_auth_provider} {...props} />
          </ApiProvider>
        ),
      },
    });

    await waitFor(() => {
      expect(rendered.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    expect(
      rendered.queryByRole('button', { name: /Sign In/i }),
    ).not.toBeInTheDocument();

    await waitFor(() => {
      expect(rendered.getByText('guest')).toBeInTheDocument();
    });
  });
});
