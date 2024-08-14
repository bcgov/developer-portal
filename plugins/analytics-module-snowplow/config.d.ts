export interface Config {
  app: {
    analytics?: {
      snowplow: {
      /**
       *
       * @visibility frontend
       */
        enabled: boolean;
      /**
       *
       * @visibility frontend
       */
        collectorUrl: string;
      /**
       *
       * @visibility frontend
       */
        appId?: string;
      /**
       *
       * @visibility frontend
       */
        trackerId?: string;
      /**
       *
       * @visibility frontend
       */
        cookieLifetime?: number;
      /**
       *
       * @visibility frontend
       */
        debounceTime?: number;
      }
    }
  }
}
