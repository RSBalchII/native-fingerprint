#!/bin/bash
# Script to build prebuilds for all supported platforms
# This script is meant to be run on a machine with cross-compilation capabilities

set -e

echo "Building prebuilds for native-fingerprint..."

# Clean previous builds
rm -rf prebuilds/
mkdir -p prebuilds/

# Build for current platform
echo "Building for current platform..."
npm run prebuild

# If running on a CI environment with multiple platforms available
# this would build for all supported platforms
if [ "$CI" = "true" ]; then
    echo "Running in CI environment, building for all platforms..."
    # The actual building for different platforms would happen in the CI matrix
else
    echo "Local build completed. For full cross-platform builds, use the CI workflow."
fi

echo "Prebuilds generated successfully!"