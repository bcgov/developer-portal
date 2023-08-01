# From https://github.com/janus-idp/backstage-showcase/
# Stage 1 - Install dependencies
FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS deps
USER 0

# Env vars
ENV YARN=./.yarn/releases/yarn-1.22.19.cjs
ENV REMOTE_SOURCES=.
ENV REMOTE_SOURCES_DIR=/opt/app-root/src

WORKDIR $REMOTE_SOURCES_DIR/
COPY $REMOTE_SOURCES $REMOTE_SOURCES_DIR
RUN chmod +x $REMOTE_SOURCES_DIR/.yarn/releases/yarn-1.22.19.cjs

# Remove all files except package.json
RUN find packages -mindepth 2 -maxdepth 2 \! -name "package.json" -exec rm -rf {} \+

RUN $YARN install --frozen-lockfile --network-timeout 600000 --ignore-scripts

# Stage 2 - Build packages
FROM registry.access.redhat.com/ubi9/nodejs-18:latest AS build
USER 0

# Env vars
ENV YARN=./.yarn/releases/yarn-1.22.19.cjs
ENV REMOTE_SOURCES=.
ENV REMOTE_SOURCES_DIR=/opt/app-root/src

WORKDIR $REMOTE_SOURCES_DIR/
COPY $REMOTE_SOURCES $REMOTE_SOURCES_DIR
COPY --from=deps $REMOTE_SOURCES_DIR $REMOTE_SOURCES_DIR
RUN chmod +x $REMOTE_SOURCES_DIR/.yarn/releases/yarn-1.22.19.cjs
RUN git config --global --add safe.directory $REMOTE_SOURCES_DIR/

RUN $YARN tsc
RUN $YARN build:backend

# Stage 3 - Build the actual backend image and install production dependencies
FROM registry.access.redhat.com/ubi9/nodejs-18-minimal:1 AS runner
USER 0

# Install gzip for tar and clean up
RUN microdnf install -y gzip && microdnf clean all

# Env vars
ENV YARN=./.yarn/releases/yarn-1.22.19.cjs
ENV REMOTE_SOURCES=.
ENV REMOTE_SOURCES_DIR=/opt/app-root/src

WORKDIR $REMOTE_SOURCES_DIR/
COPY --from=build --chown=1001:1001 $REMOTE_SOURCES_DIR/.yarn $REMOTE_SOURCES_DIR/.yarn
COPY --from=build --chown=1001:1001 $REMOTE_SOURCES_DIR/.yarnrc.yml $REMOTE_SOURCES_DIR/
RUN chmod +x $REMOTE_SOURCES_DIR/.yarn/releases/yarn-1.22.19.cjs

# Copy the install dependencies from the build stage and context
COPY --from=build --chown=1001:1001 $REMOTE_SOURCES_DIR/yarn.lock $REMOTE_SOURCES_DIR/package.json $REMOTE_SOURCES_DIR/packages/backend/dist/skeleton.tar.gz $REMOTE_SOURCES_DIR/
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# Copy the built packages from the build stage
COPY --from=build --chown=1001:1001 $REMOTE_SOURCES_DIR/packages/backend/dist/bundle.tar.gz $REMOTE_SOURCES_DIR/
RUN tar xzf $REMOTE_SOURCES_DIR/bundle.tar.gz && rm $REMOTE_SOURCES_DIR/bundle.tar.gz

# Copy any other files that we need at runtime
COPY --chown=1001:1001 $REMOTE_SOURCES/app-config.yaml \
$REMOTE_SOURCES/app-config.production.yaml \
$REMOTE_SOURCES/catalog-info.yaml \
$REMOTE_SOURCES/catalog-seed.yaml $REMOTE_SOURCES_DIR/

# Install production dependencies
RUN $YARN install --frozen-lockfile --production --network-timeout 600000 --ignore-scripts && $YARN cache clean

# The fix-permissions script is important when operating in environments that dynamically use a random UID at runtime, such as OpenShift.
# The upstream backstage image does not account for this and it causes the container to fail at runtime.
RUN fix-permissions $REMOTE_SOURCES_DIR/

# Switch to nodejs user
USER 1001

ENTRYPOINT ["node", "packages/backend", "--config", "app-config.yaml", "--config", "app-config.production.yaml"]