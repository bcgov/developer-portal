# From https://github.com/janus-idp/backstage-showcase/
# Stage 1 - Build nodejs skeleton

FROM registry.access.redhat.com/ubi9/nodejs-20:9.6-1749604222 AS skeleton
USER 0

RUN dnf install -y -q --allowerasing --nobest \
  python3 gcc gcc-c++ zlib-devel brotli-devel openssl-devel && \
  dnf update -y && dnf clean all


# Env vars
ENV YARN=./.yarn/releases/yarn-4.4.1.cjs
ENV EXTERNAL_SOURCE=.
ENV CONTAINER_SOURCE=/opt/app-root/src

WORKDIR $CONTAINER_SOURCE/
COPY $EXTERNAL_SOURCE/.yarn ./.yarn
COPY $EXTERNAL_SOURCE/.yarnrc.yml ./
RUN chmod +x "$YARN"

# Stage 2 - Install dependencies
FROM skeleton AS deps

COPY $EXTERNAL_SOURCE/package.json $EXTERNAL_SOURCE/yarn.lock $EXTERNAL_SOURCE/backstage.json ./
COPY $EXTERNAL_SOURCE/packages/app/package.json ./packages/app/package.json
COPY $EXTERNAL_SOURCE/packages/backend/package.json ./packages/backend/package.json
COPY $EXTERNAL_SOURCE/plugins/ ./plugins/

RUN "$YARN" install --immutable

# Stage 3 - Build packages
FROM deps AS build

COPY $EXTERNAL_SOURCE ./
RUN git config --global --add safe.directory ./

RUN $YARN tsc
RUN $YARN build:backend

# Stage 4 - Build the actual backend image and install production dependencies
FROM skeleton AS cleanup

# Copy the install dependencies from the build stage and context
COPY --from=build $CONTAINER_SOURCE/yarn.lock $CONTAINER_SOURCE/package.json $CONTAINER_SOURCE/backstage.json $CONTAINER_SOURCE/packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# Copy the built packages from the build stage
COPY --from=build $CONTAINER_SOURCE/packages/backend/dist/bundle.tar.gz ./
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# Copy app-config files needed in runtime
COPY $EXTERNAL_SOURCE/app-config.yaml  \
  $EXTERNAL_SOURCE/app-config.production.yaml \
  $EXTERNAL_SOURCE/catalog-info.yaml ./

# Install production dependencies
RUN "$YARN" workspaces focus --all --production && "$YARN" cache clean

# Stage 5 - Build the runner image
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:9.6-1749489516 AS runner
USER 0

# Env vars
ENV YARN=./.yarn/releases/yarn-4.4.1.cjs
ENV CONTAINER_SOURCE=/opt/app-root/src

WORKDIR $CONTAINER_SOURCE/
COPY --from=cleanup --chown=1001:1001 $CONTAINER_SOURCE/ ./

# The fix-permissions script is important when operating in environments that dynamically use a random UID at runtime, such as OpenShift.
# The upstream backstage image does not account for this and it causes the container to fail at runtime.

RUN fix-permissions ./
# Switch to nodejs user
USER 1001
ENV NODE_OPTIONS=--no-node-snapshot
ENTRYPOINT ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]
