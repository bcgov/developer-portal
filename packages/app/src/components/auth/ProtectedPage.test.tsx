import { waitFor } from '@testing-library/react';
import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { ProtectedPage } from './ProtectedPage';
import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef, githubAuthApiRef } from '@backstage/core-plugin-api';
import { getIdentityResponse } from './helpers';

jest.mock('./helpers', () => ({
  getIdentityResponse: jest.fn(),
}));

const mockGetIdentityResponse = getIdentityResponse as jest.Mock;

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  githubAuthApiRef: jest.fn(),
}));

const mockGithubAuthApi = {
  getBackstageIdentity: jest.fn(),
};

describe('ProtectedPage Tests', () => {
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

  it('should render protected page when logged in with auth provider', async () => {
    const mockConfig = createMockConfig();
    mockGetIdentityResponse.mockResolvedValueOnce({
      token: 'mock-tocken',
      expiresAt: new Date(),
      identity: {
        type: 'user',
        userEntityRef: 'user:default/mockuser',
        ownershipEntityRefs: ['group:default/mockgroup'],
      },
    });

    const apiRegistry = TestApiRegistry.from(
      [configApiRef, mockConfig],
      [githubAuthApiRef, mockGithubAuthApi],
    );

    const rendered = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <ProtectedPage provider={github_auth_provider}>
          <div>test protected</div>
        </ProtectedPage>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(rendered.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // rendered.debug();
    await waitFor(() => {
      expect(
        rendered.queryByRole('button', { name: /Sign In/i }),
      ).not.toBeInTheDocument();
      expect(rendered.getByText('test protected')).toBeInTheDocument();
    });
  });

  it('should show login when not logged in with auth provider', async () => {
    const mockConfig = createMockConfig();
    mockGetIdentityResponse.mockResolvedValueOnce(undefined);

    const apiRegistry = TestApiRegistry.from(
      [configApiRef, mockConfig],
      [githubAuthApiRef, mockGithubAuthApi],
    );

    const rendered = await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <ProtectedPage provider={github_auth_provider}>
          <div>test protected</div>
        </ProtectedPage>
      </ApiProvider>,
    );

    await waitFor(() => {
      expect(rendered.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // rendered.debug();
    await waitFor(() => {
      expect(
        rendered.queryByRole('button', { name: /Sign In/i }),
      ).toBeInTheDocument();
      expect(rendered.queryByText('test protected')).not.toBeInTheDocument();
    });
  });
});
