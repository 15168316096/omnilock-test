#!/bin/bash

set -e

lumos_steps() {
  git clone https://github.com/ckb-js/lumos.git
  cd lumos && pnpm install && pnpm run build
}

lumos_steps
