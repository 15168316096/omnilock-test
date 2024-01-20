#!/bin/bash

set -e
script_steps() {
    echo "Cloning repository..."
    git clone https://github.com/XuJiandong/omnilock.git

    cd omnilock || exit 1

    echo "Checking out specific commit..."
    git checkout migrate-pr

    echo "Updating submodules..."
    git submodule update --init --recursive

    echo "Building with Docker..."
    make all-via-docker

    echo "Copy omni_lock binary"
    cp build/omni_lock  ../source/contracts/
}

script_steps