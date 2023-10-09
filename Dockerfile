FROM node:18 as builder
WORKDIR /app
ENV NODE_ENV=development
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV LEONARDO_API_KEY=$LEONARDO_API_KEY
ENV PINATA_API_KEY=$PINATA_API_KEY
ENV PINATA_API_SECRET=$PINATA_API_SECRET
ENV IPFS_URL_PREFIX=$IPFS_URL_PREFIX
ENV BASE_CONFIG_IPFS=$BASE_CONFIG_IPFS
ENV LOCATION_LIST_IPFS=$LOCATION_LIST_IPFS
ENV DB_SOURCE=logs.sqlite
ENV GLOBAL_AI_PROMPT_PREFIX=Consider the storyteller to be very sarcastic.
ENV LOG_PROMPTS=true
# Contract
ENV PRIVATE_KEY=$PRIVATE_KEY
ENV JSON_RPC_URL=https://fork.oostvoort.work
ENV CHAIN_ID=1
#Map
ENV MAP_SEED

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

# Install pnpm
RUN npm install -g pnpm

RUN apt-get update && apt-get install -y \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libatspi2.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
#    libgtk-4-1 \
    libnspr4 \
    libnss3 \
    libwayland-client0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    xdg-utils \
    libu2f-udev \
    libvulkan1

 # Chrome instalation
RUN curl -LO  https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN dpkg -i ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb
# Check chrome version
RUN echo "Chrome: " && google-chrome --version

# Copy the necessary files
COPY ./pnpm-lock.yaml ./
COPY ./pnpm-workspace.yaml ./
COPY ./package.json ./
COPY ./packages/client/package.json ./packages/client/package.json
COPY ./packages/server/package.json ./packages/server/package.json
COPY ./packages/contracts/package.json ./packages/contracts/package.json
COPY ./packages/types/package.json ./packages/types/package.json

# Install dependencies
RUN pnpm install:deps

# Build the project
COPY ./packages ./packages
RUN pnpm prepare
RUN pnpm build

RUN cp -r ./packages/client/dist/* ./packages/server/public/

ENTRYPOINT ["pnpm", "dev:server"]
