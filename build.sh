#!/bin/bash
# Build script for Render - builds client and copies to server/client-dist
set -e

echo "=== Installing root dependencies (client) ==="
cd /opt/render/project/src
npm install --legacy-peer-deps

echo "=== Building React client ==="
npm run build

echo "=== Copying client build to server/client-dist ==="
rm -rf server/client-dist
cp -r dist server/client-dist

echo "=== Installing server dependencies ==="
cd server
npm install

echo "=== Build complete ==="
ls -la client-dist/
