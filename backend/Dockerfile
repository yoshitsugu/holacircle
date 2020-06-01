FROM rust:1.43.1-slim

WORKDIR /usr/src/app

RUN set -ex \
    && apt-get update \
    && apt-get install -y \
                 postgresql \
                 libpq-dev \
                 libssl-dev \
                 fonts-vlgothic \
                 locales \
                 locales-all \
                 vim \
                 pkg-config \
                 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN cargo install cargo-watch
RUN cargo install cargo-edit
RUN cargo install diesel_cli --no-default-features --features postgres

ENV HOST 0.0.0.0
