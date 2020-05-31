# !/bin/sh

set -eu

diesel setup
diesel migration run
cargo watch -x run
