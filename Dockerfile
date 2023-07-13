FROM node:18 as builder
WORKDIR /app

# Install prerequisites
RUN apt-get update && apt-get install -y \
    curl

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

# Set environment variables for Rust and Cargo
ENV PATH="/root/.cargo/bin:${PATH}"
ENV USER=root

# Install foundry
SHELL ["/bin/bash", "-c"]
RUN curl -L https://foundry.paradigm.xyz | bash
RUN source ~/.bashrc
ENV PATH="/root/.foundry/bin:${PATH}"

# Copy the necessary files
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./package.json ./
COPY ./packages/client/package.json ./packages/client/package.json
COPY ./packages/server/package.json ./packages/server/package.json
COPY ./packages/contracts/package.json ./packages/contracts/package.json
COPY ./packages/types/package.json ./packages/types/package.json

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install:deps

# Build the project
COPY ./packages ./packages
RUN pnpm build

RUN cp -r ./packages/client/dist/* ./packages/server/public/


#FROM node:18-alpine as runtime
#WORKDIR /opt
#
#COPY --from=builder /app/package.json ./package.json
#COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
#COPY --from=builder /app/packages/server ./packages/server
#COPY --from=builder /app/packages/fantasy-map-generator ./packages/fantasy-map-generator
#COPY --from=builder /app/node_modules ./node_modules
#COPY --from=builder /app/packages/client/dist ./packages/server/public
#COPY --from=builder /app/packages/types ./packages/types
#COPY --from=builder /app/packages/contracts/types ./packages/contracts/types
#COPY --from=builder /app/packages/contracts/worlds.json ./packages/contracts/worlds.json
#COPY --from=builder /app/packages/contracts/package.json ./packages/contracts/package.json
#COPY --from=builder /app/packages/contracts/node_modules ./packages/contracts/node_modules
#
## Install dependencies
#RUN npm install -g pnpm

ENTRYPOINT ["pnpm", "dev:server"]
