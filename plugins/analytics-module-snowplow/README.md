# analytics-module-snowplow

Welcome to the analytics-module-snowplow plugin!

_This plugin was created through the Backstage CLI_

This plugin provides the configuration options for snowplow. Currently it is a js file included in the "head" element of the [index.html](/packages/app/public/index.html) file.

Example configuration:

```yaml
#app-config.yaml

app:
  analytics:
    snowplow: 
      enabled: true | false
```

Use the [snowplow inspector plugin for chrome](https://chrome.google.com/webstore/detail/snowplow-inspector/maplkdomeamdlngconidoefjpogkmljm?hl=en) to see the calls going out from your browser.

## Getting started

Your plugin has been added to the example app in this repository, meaning you'll be able to access it by running `yarn start` in the root directory, and then navigating to [/analytics-module-snowplow](http://localhost:3000/analytics-module-snowplow).

You can also serve the plugin in isolation by running `yarn start` in the plugin directory.
This method of serving the plugin provides quicker iteration speed and a faster startup and hot reloads.
It is only meant for local development, and the setup for it can be found inside the [/dev](./dev) directory.
