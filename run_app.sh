#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

python -m venv "$ROOT_DIR/.venv"
source "$ROOT_DIR/.venv/bin/activate"

python -m pip install --upgrade pip
python -m pip install -r "$ROOT_DIR/requirements.txt"

python "$ROOT_DIR/app.py"
