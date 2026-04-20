#!/bin/zsh

ROOT_DIR="${${(%):-%N}:A:h:h}"

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "nvm not found at $NVM_DIR" >&2
  return 1
fi

. "$NVM_DIR/nvm.sh"

if [ ! -f "$ROOT_DIR/.nvmrc" ]; then
  echo ".nvmrc not found at $ROOT_DIR/.nvmrc" >&2
  return 1
fi

current_dir="$PWD"
cd "$ROOT_DIR" || return 1
nvm use >/dev/null || nvm install >/dev/null || {
  cd "$current_dir" || return 1
  return 1
}
cd "$current_dir" || return 1
