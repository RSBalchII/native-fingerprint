# Prebuild System Configuration for Native Node.js Modules

## Overview
This document describes how to configure pre-compiled binaries for native Node.js modules using node-addon-api. The configuration enables distribution of prebuilt binaries for Windows, macOS, and Linux via npm.

## Package.json Configuration

### Using prebuildify + prebuild-install (Recommended)

```json
{
  "scripts": {
    "install": "prebuild-install || node-gyp rebuild",
    "prebuild": "prebuildify --napi",
    "prebuild-all": "prebuildify --napi --all"
  },
  "dependencies": {
    "node-addon-api": "^7.0.0",
    "prebuild-install": "^7.1.1"
  },
  "devDependencies": {
    "prebuildify": "^6.0.1"
  },
  "binary": {
    "module_name": "your_module_name",
    "module_path": "./lib/binding/napi-v{napi_build_version}-{platform}-{arch}",
    "package_name": "{module_name}-v{version}-{napi_build_version}-{platform}-{arch}.tar.gz",
    "host": "https://github.com/USERNAME/REPO/releases/download/",
    "napi_versions": [3, 4, 5, 6, 7, 8]
  }
}
```

### Alternative: Using node-pre-gyp

```json
{
  "scripts": {
    "install": "node-pre-gyp install --fallback-to-build",
    "build": "node-pre-gyp rebuild",
    "prebuild": "node-pre-gyp rebuild --build-from-source",
    "package": "node-pre-gyp package"
  },
  "dependencies": {
    "node-addon-api": "^7.0.0",
    "node-pre-gyp": "^1.0.11"
  },
  "binary": {
    "module_name": "your_module_name",
    "module_path": "./lib/binding/{configuration}/{node_abi}-{platform}-{arch}/",
    "remote_path": "./{name}/v{version}/{configuration}/",
    "package_name": "{module_name}-v{version}-{node_abi}-{platform}-{arch}.tar.gz",
    "host": "https://github.com/USERNAME/REPO/releases/download/"
  }
}
```

### Alternative: Using node-gyp-build

```json
{
  "scripts": {
    "install": "node-gyp-build"
  },
  "dependencies": {
    "node-addon-api": "^7.0.0",
    "node-gyp-build": "^4.8.0"
  },
  "binary": {
    "module_name": "your_module_name"
  }
}
```

## GitHub Actions Workflow

The following workflow builds prebuilt binaries for all supported platforms:

```yaml
name: Build and Publish Prebuilds

on:
  push:
    branches: [main, master]
    tags: ['v*']
  pull_request:
    branches: [main, master]

jobs:
  build-prebuilds:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
        
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          
      - name: Install dependencies (Ubuntu)
        if: matrix.os == 'ubuntu-latest'
        run: |
          sudo apt-get update
          sudo apt-get install -y build-essential python3-dev
          
      - name: Install dependencies (macOS)
        if: matrix.os == 'macos-latest'
        run: |
          brew install python3
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build prebuilds
        run: npm run prebuild-all
        
      - name: Upload prebuild artifacts
        uses: actions/upload-artifact@v4
        with:
          name: prebuilds-${{ matrix.os }}-node${{ matrix.node }}
          path: ./prebuilds/
          retention-days: 5

  publish-prebuilds:
    needs: build-prebuilds
    runs-on: ubuntu-latest
    if: startsWith(github.ref, 'refs/tags/v')
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          registry-url: https://registry.npmjs.org/
          
      - name: Download all prebuild artifacts
        uses: actions/download-artifact@v4
        with:
          path: ./artifacts
          
      - name: Combine prebuilds
        run: |
          mkdir -p prebuilds
          find ./artifacts -name "*.tar.gz" -exec cp {} ./prebuilds/ \;
          
      - name: Publish to GitHub Releases
        uses: softprops/action-gh-release@v1
        with:
          files: prebuilds/*
          draft: false
          prerelease: false
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          
      - name: Publish to npm
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Platform Support Matrix

| Platform | Architectures | Node.js Versions | N-API Versions |
|----------|---------------|------------------|----------------|
| Windows  | x64, arm64    | 16.x+            | 3-8            |
| macOS    | x64, arm64    | 16.x+            | 3-8            |
| Linux    | x64, arm64    | 16.x+            | 3-8            |

## Binding.gyp Considerations

When using prebuilds, ensure your binding.gyp file is compatible with all target platforms:

```json
{
  "targets": [
    {
      "target_name": "your_target_name",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [
        "./src/your_source_files.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      "defines": [ "NAPI_DISABLE_CPP_EXCEPTIONS" ],
      "conditions": [
        ["OS=='win'", {
          "msvs_settings": {
            "VCCLCompilerTool": {
              "ExceptionHandling": 0,
              "AdditionalOptions": ["/std:c++17"]
            }
          }
        }],
        ["OS=='linux'", {
          "cflags_cc": [ "-std=c++17", "-O3" ],
          "cflags": [ "-O3" ]
        }],
        ["OS=='mac'", {
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "NO",
            "CLANG_CXX_LIBRARY": "libc++",
            "MACOSX_DEPLOYMENT_TARGET": "10.15",
            "CLANG_CXX_LANGUAGE_STANDARD": "c++17",
            "OTHER_CPLUSPLUSFLAGS": [
              "-std=c++17",
              "-stdlib=libc++",
              "-O3"
            ],
            "OTHER_LDFLAGS": [
              "-stdlib=libc++"
            ]
          },
          "cflags_cc": ["-std=c++17", "-stdlib=libc++", "-O3"],
          "ldflags": ["-stdlib=libc++"]
        }]
      ]
    }
  ]
}
```

## Testing Prebuilds

Create a test workflow to verify prebuilds work correctly:

```yaml
  test-prebuilds:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
        node: [18, 20]
        
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
          
      - name: Install from prebuilds
        run: npm install your-package-name
        
      - name: Run tests with prebuilds
        run: npm test
        working-directory: node_modules/your-package-name
```

## Publishing Process

1. Update version in package.json
2. Commit and push changes
3. Create a Git tag: `git tag v1.x.x`
4. Push tag: `git push origin v1.x.x`
5. The GitHub Action will automatically build and publish prebuilds to GitHub Releases
6. The action will also publish the package to npm

## Troubleshooting

### Common Issues:

1. **Platform not supported**: Check that the target platform is included in the build matrix
2. **Architecture mismatch**: Ensure both x64 and arm64 builds are available if needed
3. **Node version compatibility**: Verify that the N-API version supports the target Node.js versions
4. **Missing dependencies**: Ensure all build dependencies are installed in the CI environment

### Debugging Tips:

1. Test locally with `npm install --build-from-source` to force compilation
2. Check the prebuilds directory after running `npm run prebuild-all`
3. Verify that the binary naming convention matches the expected pattern
4. Use `node -p "process.platform + '-' + process.arch + '-' + process.versions.napi"` to check your system's identifiers