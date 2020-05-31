# !/bin/sh

set -eu

diesel setup
diesel migration
cargo watch -x run
