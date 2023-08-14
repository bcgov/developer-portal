export interface Config {
  app: {
    analytics?: {
      snowplow: {
      /**
       * 
       * @visibility frontend
       */
        enabled: boolean;
      } 
    }
  }
}