#!/bin/bash

set -e

lumos_steps() {
  git clone -b omnilock-bitcoin-auth https://github.com/15168316096/lumos.git
  cd lumos && npm install -g pnpm && pnpm install && pnpm run build
}

lumos_steps
