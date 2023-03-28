# Based on the https://github.com/janus-idp/redhat-backstage-build/blob/main/Dockerfile
FROM registry.access.redhat.com/ubi9/nodejs-18-minimal:latest AS runner
USER 0

# Install yarn
RUN \
    curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo && \
    microdnf install -y yarn

# Install gzip for tar and clean up
RUN microdnf install -y gzip && microdnf clean all

# Switch to nodejs user
USER 1001

# Copy the install dependencies from the build stage and context
COPY yarn.lock package.json packages/backend/dist/skeleton.tar.gz ./
RUN tar xzf skeleton.tar.gz && rm skeleton.tar.gz

# Install production dependencies
RUN yarn install --frozen-lockfile --production --network-timeout 600000 && yarn cache clean

# Copy the built packages from the build stage
COPY packages/backend/dist/bundle.tar.gz .
RUN tar xzf bundle.tar.gz && rm bundle.tar.gz

# Copy any other files that we need at runtime
COPY ./app-config.yaml .

# The fix-permissions script is important when operating in environments that dynamically use a random UID at runtime, such as OpenShift.
# The upstream backstage image does not account for this and it causes the container to fail at runtime.
RUN fix-permissions ./

CMD ["node", "packages/backend", "--config", "app-config.yaml"]