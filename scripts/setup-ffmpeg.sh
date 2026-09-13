#!/bin/sh
set -eu

ROOT="$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)"
BIN="$ROOT/bin"

URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
ARCHIVE="$BIN/ffmpeg.tar.xz"

mkdir -p "$BIN"

if [ -x "$BIN/ffmpeg" ] && "$BIN/ffmpeg" -version >/dev/null 2>&1; then
  echo "FFmpeg already installed: $BIN/ffmpeg"
  exit 0
fi

echo "Downloading FFmpeg..."

rm -f "$ARCHIVE"
rm -rf "$BIN"/ffmpeg-*-amd64-static

wget -O "$ARCHIVE" "$URL"

echo "Extracting FFmpeg..."

tar -xJf "$ARCHIVE" -C "$BIN"

FFDIR="$(find "$BIN" -maxdepth 1 -type d -name 'ffmpeg-*-amd64-static' | head -n 1)"

if [ -z "$FFDIR" ]; then
  echo "ERROR: FFmpeg directory not found after extraction"
  exit 1
fi

cp "$FFDIR/ffmpeg" "$BIN/ffmpeg"
chmod +x "$BIN/ffmpeg"

rm -rf "$FFDIR" "$ARCHIVE"

echo "Testing FFmpeg..."
"$BIN/ffmpeg" -version

echo "FFmpeg installed successfully: $BIN/ffmpeg"
