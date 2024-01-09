#!/bin/bash

set -e
script_steps() {
    echo "Cloning repository..."
    git clone https://github.com/nervosnetwork/ckb-production-scripts

    cd ckb-production-scripts || exit 1

    echo "Checking out specific commit..."
    git checkout 9785769ded9404985531925d66043320af71adbf

    echo "Updating submodules..."
    git submodule update --init --recursive

    echo "Building with Docker..."
    make all-via-docker

    echo "Copy omni_lock binary"
    cp build/omni_lock  ../source/contract/
}

script_steps