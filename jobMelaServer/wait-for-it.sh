#!/usr/bin/env bash
# wait-for-it.sh - wait until a service is available

set -e

host="db"
port=5432
timeout=60

echo "Waiting for $host:$port to be available..."

for i in $(seq $timeout); do
  if nc -z "$host" "$port" >/dev/null 2>&1; then
    echo "$host:$port is available!"
    exit 0
  fi
  sleep 1
done

echo "Timeout reached: $host:$port is still not available."
exit 1
