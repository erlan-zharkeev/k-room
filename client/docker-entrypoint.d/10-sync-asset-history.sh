#!/bin/sh

set -eu

HTML_DIR="${CLIENT_HTML_DIR:-/usr/share/nginx/html}"
ASSET_HISTORY_DIR="${CLIENT_ASSET_HISTORY_DIR:-/usr/share/nginx/asset-history}"
IMAGE_ASSETS_DIR="$HTML_DIR/assets"
CURRENT_DIR="$ASSET_HISTORY_DIR/current"
CURRENT_ASSETS_DIR="$CURRENT_DIR/assets"
FALLBACK_DIR="$ASSET_HISTORY_DIR/fallback"
FALLBACK_ASSETS_DIR="$FALLBACK_DIR/assets"
BUILD_ID_FILE="$CURRENT_DIR/build-id"

if [ ! -d "$IMAGE_ASSETS_DIR" ]; then
  exit 0
fi

mkdir -p "$CURRENT_DIR" "$FALLBACK_DIR"

BUILD_ID="$(
  find "$IMAGE_ASSETS_DIR" -type f | sort | while IFS= read -r asset_file; do
    sha256sum "$asset_file"
  done | sha256sum | awk '{ print $1 }'
)"
CURRENT_BUILD_ID="$(cat "$BUILD_ID_FILE" 2>/dev/null || true)"

if [ "$BUILD_ID" = "$CURRENT_BUILD_ID" ] && [ -d "$CURRENT_ASSETS_DIR" ]; then
  exit 0
fi

if [ -d "$CURRENT_ASSETS_DIR" ]; then
  rm -rf "$FALLBACK_DIR"
  mkdir -p "$FALLBACK_DIR"
  cp -a "$CURRENT_ASSETS_DIR" "$FALLBACK_ASSETS_DIR"
fi

rm -rf "$CURRENT_DIR"
mkdir -p "$CURRENT_DIR"
cp -a "$IMAGE_ASSETS_DIR" "$CURRENT_ASSETS_DIR"
printf '%s\n' "$BUILD_ID" > "$BUILD_ID_FILE"
