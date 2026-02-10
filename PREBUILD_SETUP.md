# Native Fingerprint - Prebuild Configuration Guide

## Overview
This package provides pre-compiled binaries for faster installation on various platforms. The prebuild system automatically downloads the appropriate binary for your platform and Node.js version.

## Installation
When you install this package, it will attempt to download a pre-compiled binary. If that fails, it will fall back to compiling from source:

```bash
npm install @rbalchii/native-fingerprint
```

## Building Prebuilds Locally
To build prebuilds for your own platform:

```bash
npm run prebuild
```

To build for all supported platforms (requires cross-compilation setup):

```bash
npm run prebuild-all
```

## Supported Platforms
- Windows (x64, arm64)
- macOS (x64, arm64)
- Linux (x64, arm64)

## Node.js Version Support
- Node.js 16.x and later
- Supports N-API versions 3-8

## Troubleshooting
If you encounter issues:
1. Check that your platform and Node.js version are supported
2. Verify that you have network access to download the prebuild
3. If all else fails, the system will fall back to compiling from source

## Development
For developers contributing to this package:
- Update the binding.gyp file to reflect any changes to the native code
- Run tests after making changes: `npm test`
- When releasing a new version, the CI will automatically build and upload prebuilds