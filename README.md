# Developer Portal

This is the developer portal for the Province of British Columbia built using [backstage](https://backstage.io). 

It uses the [Backstage Helm Chart](https://github.com/backstage/charts).

## Local Development

### Required Tools
1. Node [long-term-support version](https://nodejs.dev/en/about/releases/) (i.e. lts/hydrogen)
1. Docker Desktop

### Setup
1. For development purposes, the in memory SQLite database is sufficient (it is already configured)
    1. Alternativley, [Postgres](https://www.postgresql.org) can be configured 
        1. Install [Postgres locally](https://www.postgresql.org/download/) or via [docker](https://hub.docker.com/_/postgres)
        1. Create an `app-config.local.yaml` file in the project's root directory and provide the following configurations:
        ```yaml
        database:
            client: pg
            connection:
                host: ${POSTGRES_HOST}
                port: ${POSTGRES_PORT}
                user: ${POSTGRES_USER}
                password: ${POSTGRES_PASSWORD}
        ```
1. Backstage requires a [GitHub Access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). 
    1. It requires `repo` and `workflow` access
    1. Provide the github token in the `app-config.local.yaml` file, this will override the GitHub setting in the `app-config.yaml` file. Alternatively, set the `GITHUB_TOKEN` environment variable.
    ```yaml
    integrations:
        github:
           - host: github.com
             token: ghp_your_token_here 
    ```

### Running
To run the project, use the following at the project's root directory
```
$ yarn install
$ yarn dev
```

### More information
See the [Backstage.io documentation](https://backstage.io/docs/getting-started/)

## Local deployment
This section describes how to use [OpenShift Local](https://developers.redhat.com/products/openshift-local/overview) to test the deployment configurations locally.

### OpenShift Local Installation

See [the installation instructions](https://access.redhat.com/documentation/en-us/red_hat_openshift_local/2.15)

#### Installation Troubleshooting

##### `com.redhat.crc.daemon.plist: permission denied` 

During the `crc setup` process, the following error occurs:

```
INFO Checking if crc daemon plist file is present and loaded
INFO Adding crc daemon plist file and loading it
open /Users/<username>/Library/LaunchAgents/com.redhat.crc.daemon.plist: permission denied
```

This error occurs because the owner of `~/Library/LaunchAgents/` is `root`.

The fix:

1. Change the write permissions on `~/Library/LaunchAgents/`:

    ```
    $ sudo chmod g+w Library/LaunchAgents
    ```

1. Re-run the `crc setup` command.


#### Usage

See the [RedHat Tutorial Video](https://developers.redhat.com/products/openshift-local/getting-started) for more information.


##### Web console warning

Evoking the `crc console` command may result in the browser warning the website is not secure. This is ok since it is only running locally. 

Login with the developer user and password at the login screen.


### Backstage deployment to OpenShift Local

#### Build the image

In the root of the project, run the following command. Replace the 1.0.0 tag with your tag.
```shell
$ docker build . -f packages/backend/Dockerfile --tag backstage:1.0.0
```

#### Install the image into the OpenShift Local Internal Registry

[Accessing the internal OpenShift registry](https://access.redhat.com/documentation/en-us/red_hat_openshift_local/2.15/html/getting_started_guide/using_gsg#accessing-the-internal-openshift-registry_gsg) first. After logging into the registry:


1. Find the docker image
    ```shell
    $ docker images | grep backstage
    backstage  1.0.0  43b37a22bdab   1 minute ago  612MB
    ```
1. Tag with the local registry location
    ```shell
    $ docker tag 43b37a22bdab default-route-openshift-image-registry.apps-crc.testing/backstage/backstage:1.0.0
    ```
1. Push to the local registry
    ```
    $ docker push default-route-openshift-image-registry.apps-crc.testing/backstage/backstage:1.0.0
    ```
    1. Note: if you get an "access denied" error, make sure you have logged into the registry (see [Accessing the internal OpenShift registry](https://access.redhat.com/documentation/en-us/red_hat_openshift_local/2.15/html/getting_started_guide/using_gsg#accessing-the-internal-openshift-registry_gsg)).


#### Backstage Deployment Configuration

##### Add the GitHub Token as a secret
```yaml
# secrets.yaml file
apiVersion: v1
kind: Secret
metadata:
  name: backstage-secrets
  namespace: backstage
type: Opaque
data:
  GITHUB_TOKEN: base64_encoded_github_token
```

Note: the GitHub token must be base64 encoded. Example:
```shell
$ echo "ghp_xxxxxxxxxxx" | base64
```

```shell
$ oc apply -f secrets.yaml
```

#### Deploy Backstage To OpenShift Local

Follow the instructions in [Deploying Backstage onto OpenShift Using the Backstage Helm Chart](https://janus-idp.io/blog/deploying-backstage-onto-openshift-using-helm) blog post. The image and ingress info will need to be changed in the `values-openshift.yaml` file. 

```yaml
backstage:
  image:
    registry: default-route-openshift-image-registry.apps-crc.testing
    repository: backstage/backstage
    tag: 1.0.0 # the tag that was installed into the local registry
  containerSecurityContext:
    runAsNonRoot: true
    allowPrivilegeEscalation: false
    capabilities:
      drop:
      - ALL
  podSecurityContext:
    seccompProfile:
      type: RuntimeDefault
...
ingress:
  enabled: true
  host: backstage-backstage.apps-crc.testing
  ...
```

Install using helm (first run):
```shell
$ helm install backstage backstage/backstage -f values-openshift.yaml
```

Update using helm:
1. [Build the image](#build-the-image)
1. [Install the image into the OpenShift Local Internal Registry](#install-the-image-into-the-openshift-local-internal-registry)
1. Update tag in `values-openshift.yaml`
1. Run the following command

```shell
$ helm upgrade backstage backstage/backstage -f values-openshift.yaml
```

##### Warnings
When running the `values-openshift.yaml` file the following warnings will be generated:

>coalesce.go:220: warning: cannot overwrite table with non table for postgresql.networkPolicy.egressRules.customRules (map[])
W0323 13:51:08.322494   12110 warnings.go:70] would violate PodSecurity "restricted:v1.24": allowPrivilegeEscalation != false (container "backstage-backend" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "backstage-backend" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "backstage-backend" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "backstage-backend" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")
>W0323 13:51:08.349649   12110 warnings.go:70] would violate PodSecurity "restricted:v1.24": allowPrivilegeEscalation != false (container "postgresql" must set securityContext.allowPrivilegeEscalation=false), unrestricted capabilities (container "postgresql" must set securityContext.capabilities.drop=["ALL"]), runAsNonRoot != true (pod or container "postgresql" must set securityContext.runAsNonRoot=true), seccompProfile (pod or container "postgresql" must set securityContext.seccompProfile.type to "RuntimeDefault" or "Localhost")

The `containerSecurityContext` and `podSecurityContext` sections in the  `values-openshift.yaml` will prevent the first warning. They are there at the moment until the chart sets the appropriate securityContext properties. They are warnings for now but will be enforced in OCP 4.13

The postgres warning is due to a [helm bug](https://github.com/helm/helm/pull/11440). 
