# Developer Portal

[![Lifecycle:Experimental](https://img.shields.io/badge/Lifecycle-Experimental-339999)](https://github.com/bcgov/repomountie/blob/master/doc/lifecycle-badges.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Package Status](https://github.com/bcgov/developer-portal/actions/workflows/build-and-deploy.yaml/badge.svg)](https://github.com/bcgov/developer-portal/actions/workflows/build-and-deploy.yaml)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=bcgov_developer-portal&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=bcgov_developer-portal)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=bcgov_developer-portal&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=bcgov_developer-portal)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=bcgov_developer-portal&metric=bugs)](https://sonarcloud.io/summary/new_code?id=bcgov_developer-portal)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=bcgov_developer-portal&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=bcgov_developer-portal)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=bcgov_developer-portal&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=bcgov_developer-portal)

This is the developer portal for the Province of British Columbia built using [backstage](https://backstage.io). 

## Local Development

### Required Tools
* Node [long-term-support version](https://nodejs.dev/en/about/releases/) (i.e. lts/hydrogen)

### Setup
* For development purposes, the in memory SQLite database is sufficient (it is already configured)
    * Alternativley, [Postgres](https://www.postgresql.org) can be configured 
        * Install [Postgres locally](https://www.postgresql.org/download/) or via [docker](https://hub.docker.com/_/postgres)
        * Create an `app-config.local.yaml` file in the project's root directory and provide the following configurations:
        ```yaml
        database:
            client: pg
            connection:
                host: ${POSTGRES_HOST}
                port: ${POSTGRES_PORT}
                user: ${POSTGRES_USER}
                password: ${POSTGRES_PASSWORD}
        ```

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