#!/bin/zsh

export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if [ -s "$NVM_DIR/nvm.sh" ]; then
  . "$NVM_DIR/nvm.sh"
else
  echo "nvm not found at $NVM_DIR" >&2
  exit 1
fi

if [ -f ".nvmrc" ]; then
  nvm use >/dev/null || nvm install
fi

if [ -f ".env.development" ]; then
  while IFS= read -r line; do
    [[ "$line" =~ ^[[:space:]]*# ]] && continue
    [[ -z "${line// }" ]] && continue
    key="${line%%=*}"
    value="${line#*=}"
    value="${value%\'}"
    value="${value#\'}"
    if [[ -z "${(P)key}" ]]; then
      export "$key"="$value"
    fi
  done < .env.development
fi

required_env_vars=(
  "RESEND_API_KEY"
  "RESEND_FROM_EMAIL"
  "RESEND_FROM_NAME"
  "EMAIL_CONFIRM_SECRET"
  "FIREBASE_API_KEY"
  "SENTRY_DSN_CLIENT"
  "SENTRY_DSN_SERVER"
)

missing_env_vars=()

for env_var_name in "${required_env_vars[@]}"; do
  if [ -z "${(P)env_var_name}" ]; then
    missing_env_vars+=("$env_var_name")
  fi
done

if [ ${#missing_env_vars[@]} -gt 0 ]; then
  echo "Cannot start development environment. Missing required variables in .env.development:" >&2

  for env_var_name in "${missing_env_vars[@]}"; do
    case "$env_var_name" in
      "RESEND_API_KEY")
        echo "  - RESEND_API_KEY: required for password recovery and email delivery flows." >&2
        ;;
      "RESEND_FROM_EMAIL")
        echo "  - RESEND_FROM_EMAIL: sender email used by Resend." >&2
        ;;
      "RESEND_FROM_NAME")
        echo "  - RESEND_FROM_NAME: sender display name used by Resend." >&2
        ;;
      "EMAIL_CONFIRM_SECRET")
        echo "  - EMAIL_CONFIRM_SECRET: required to issue email confirmation tokens." >&2
        ;;
      "FIREBASE_API_KEY")
        echo "  - FIREBASE_API_KEY: required for Google sign-in on the client." >&2
        ;;
      "SENTRY_DSN_CLIENT")
        echo "  - SENTRY_DSN_CLIENT: required for client-side Sentry." >&2
        ;;
      "SENTRY_DSN_SERVER")
        echo "  - SENTRY_DSN_SERVER: required for server-side Sentry." >&2
        ;;
    esac
  done

  exit 1
fi

npm ci
npm run prepare
chmod +x .husky/pre-commit

if ! docker ps --format '{{.Names}}' | grep -qx 'db'; then
  if docker ps -a --format '{{.Names}}' | grep -qx 'db'; then
    docker start db >/dev/null
  else
    docker run -d -p 27017:27017 --name db mongo:latest >/dev/null
  fi
fi

if ! docker ps --format '{{.Names}}' | grep -qx 'mongo-express'; then
  if docker ps -a --format '{{.Names}}' | grep -qx 'mongo-express'; then
    docker start mongo-express >/dev/null
  else
    docker run -d \
      -p 47821:8081 \
      --name mongo-express \
      -e ME_CONFIG_BASICAUTH_USERNAME=admin \
      -e ME_CONFIG_BASICAUTH_PASSWORD=admin \
      -e ME_CONFIG_MONGODB_URL='mongodb://host.docker.internal:27017/k-room-db' \
      mongo-express:latest >/dev/null
  fi
fi

cd ./common
npm ci

cd ../server/
npm ci

cd ../client/
npm ci --legacy-peer-deps
