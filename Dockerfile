FROM node:18 AS builder
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
RUN ls -la
RUN pnpm build

ENTRYPOINT ["pnpm", "dev:server"]
