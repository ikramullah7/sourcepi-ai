#!/usr/bin/env bash
set -euo pipefail

# This installs tools on an ephemeral GitHub-hosted Ubuntu runner only.
if [[ "${GITHUB_ACTIONS:-}" != true || "${RUNNER_OS:-}" != Linux || "${RUNNER_ARCH:-}" != X64 ]]; then
  echo 'This setup script requires a GitHub-hosted Linux x64 runner.' >&2
  exit 1
fi

# Native archives and Go caches need the space occupied by unused runner SDKs.
sudo rm -rf /usr/local/lib/android /usr/share/dotnet

curl --fail --location --retry 3 https://apt.llvm.org/llvm-snapshot.gpg.key \
  | gpg --dearmor --output "$RUNNER_TEMP/llvm-archive-keyring.gpg"
sudo install -m 644 "$RUNNER_TEMP/llvm-archive-keyring.gpg" /usr/share/keyrings/llvm-archive-keyring.gpg
printf '%s\n' 'deb [signed-by=/usr/share/keyrings/llvm-archive-keyring.gpg] https://apt.llvm.org/noble/ llvm-toolchain-noble-20 main' \
  | sudo tee /etc/apt/sources.list.d/llvm-20.list >/dev/null
sudo apt-get update
sudo apt-get install -y --no-install-recommends \
  clang-20 lld-20 build-essential libpcre2-dev libsimde-dev libssl-dev pkg-config unzip

# Use official release binaries: Kitware explicitly asks CI not to use its APT mirror.
cmake_version=4.4.5
cmake_archive="cmake-${cmake_version}-linux-x86_64.tar.gz"
curl --fail --location --retry 3 --output "$RUNNER_TEMP/$cmake_archive" \
  "https://github.com/Kitware/CMake/releases/download/v${cmake_version}/${cmake_archive}"
(
  cd "$RUNNER_TEMP"
  printf '%s  %s\n' ed85135c5a5135b45e50423cb406dea04ca3338da0b8ef3c9ede963559680be0 "$cmake_archive" \
    | sha256sum --check --strict
)
mkdir -p "$RUNNER_TEMP/ci-cmake" "$RUNNER_TEMP/ci-toolchain"
tar -xzf "$RUNNER_TEMP/$cmake_archive" --strip-components=1 -C "$RUNNER_TEMP/ci-cmake"
ln -s /usr/bin/clang-20 "$RUNNER_TEMP/ci-toolchain/clang"
ln -s /usr/bin/clang++-20 "$RUNNER_TEMP/ci-toolchain/clang++"
ln -s /usr/bin/ld.lld-20 "$RUNNER_TEMP/ci-toolchain/ld.lld"
printf '%s\n' "$RUNNER_TEMP/ci-cmake/bin" "$RUNNER_TEMP/ci-toolchain" >> "$GITHUB_PATH"
df -h .
