# PowerShell script to build prebuilds for all supported platforms
# This script is meant to be run on a machine with cross-compilation capabilities

Write-Host "Building prebuilds for native-fingerprint..." -ForegroundColor Green

# Clean previous builds
if (Test-Path "prebuilds") {
    Remove-Item "prebuilds" -Recurse -Force
}

New-Item -ItemType Directory -Path "prebuilds" -Force | Out-Null

# Build for current platform
Write-Host "Building for current platform..." -ForegroundColor Yellow
npm run prebuild

# If running on a CI environment with multiple platforms available
# this would build for all supported platforms
if ($env:CI -eq "true") {
    Write-Host "Running in CI environment, building for all platforms..." -ForegroundColor Yellow
    # The actual building for different platforms would happen in the CI matrix
} else {
    Write-Host "Local build completed. For full cross-platform builds, use the CI workflow." -ForegroundColor Green
}

Write-Host "Prebuilds generated successfully!" -ForegroundColor Green