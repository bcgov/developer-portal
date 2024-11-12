# Developer Portal

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Package Status](https://github.com/bcgov/developer-portal/actions/workflows/update-gitops.yaml/badge.svg)](https://github.com/bcgov/developer-portal/actions/workflows/update-gitops.yaml)
[![CodeQL](https://github.com/bcgov/developer-portal/workflows/CodeQL/badge.svg)](https://github.com/bcgov/developer-portal/actions/workflows/github-code-scanning/codeql)

This is the [developer portal for the Province of British Columbia](https://developer.gov.bc.ca) built using [Backstage](https://backstage.io).

## Local Development

### Required Tools

- Node [long-term-support version](https://nodejs.dev/en/about/releases/) (i.e. lts/hydrogen)

### Setup

- For development purposes, the in memory SQLite database is sufficient (it is already configured)
  - Alternativley, [Postgres](https://www.postgresql.org) can be configured
    - Install [Postgres locally](https://www.postgresql.org/download/) or via [docker](https://hub.docker.com/_/postgres)
- Create an `app-config.local.yaml` file based off of the [app-config.local.yaml.template](app-config.local.yaml.template) file.

### Running

To run the project, use the following at the project's root directory

```
$ yarn install
$ yarn dev
```

### Dockerfile

Note: The dockerfile is based on the [Janus showcase project](https://github.com/janus-idp/backstage-showcase/)

### Deployment

See the [gitops repo](https://github.com/bcgov-c/tenant-gitops-f5ff48).

### More information

See the [Backstage.io documentation](https://backstage.io/docs/getting-started/)
