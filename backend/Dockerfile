FROM rust:1.43.1-slim

WORKDIR /usr/src/app

RUN set -ex \
    && apt-get update \
    && apt-get install -y \
                 default-mysql-client \
                 default-libmysqlclient-dev \
                 openssl \
                 fonts-vlgothic \
                 locales \
                 locales-all \
                 vim \
                 --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

RUN cargo install cargo-watch cargo-edit
RUN cargo install diesel_cli --no-default-features --features mysql

ENV HOST 0.0.0.0
