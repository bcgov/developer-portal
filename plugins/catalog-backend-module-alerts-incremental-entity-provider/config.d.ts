export interface Config {
  integrations: {
    /**
     *
     * @visibility backend
     */
    alerts: {
      /**
       *
       * @visibility backend
       */
      githubInstallationId: number;

      /**
       *
       * @visibility backend
       */
      githubOrganization: string;
    };
  };
}
