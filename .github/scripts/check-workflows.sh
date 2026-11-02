#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

version=1.7.12
case "$(uname -s)-$(uname -m)" in
  Linux-x86_64)
    platform=linux_amd64
    checksum=8aca8db96f1b94770f1b0d72b6dddcb1ebb8123cb3712530b08cc387b349a3d8
    ;;
  Darwin-arm64)
    platform=darwin_arm64
    checksum=aba9ced2dee8d27fecca3dc7feb1a7f9a52caefa1eb46f3271ea66b6e0e6953f
    ;;
  *)
    echo 'Install actionlint 1.7.12 and run actionlint on this platform.' >&2
    exit 1
    ;;
esac

work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT
archive="actionlint_${version}_${platform}.tar.gz"
curl --fail --location --retry 3 --output "$work_dir/$archive" \
  "https://github.com/rhysd/actionlint/releases/download/v${version}/${archive}"
(
  cd "$work_dir"
  if command -v sha256sum >/dev/null 2>&1; then
    actual=$(sha256sum "$archive" | awk '{print $1}')
  else
    actual=$(shasum -a 256 "$archive" | awk '{print $1}')
  fi
  if [[ "$actual" != "$checksum" ]]; then
    echo 'Downloaded actionlint checksum did not match the pinned release.' >&2
    exit 1
  fi
)
tar -xzf "$work_dir/$archive" -C "$work_dir" actionlint
"$work_dir/actionlint" -color .github/workflows/*.yml
