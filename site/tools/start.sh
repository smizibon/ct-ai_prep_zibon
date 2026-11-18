#!/bin/bash
# start.sh — start the CT-AI Studio dev server, self-healing if the port is occupied.
#
# Behavior:
#   1. If OUR server is already running and healthy on the port → say so, exit 0.
#   2. If the port is held by a stale serve.py OR any foreign process → evict it
#      (SIGTERM, up to 5s, then SIGKILL), wait for the port to be released.
#   3. Start tools/serve.py detached (nohup), remember its pid in tools/.server.pid,
#      and wait until it answers HTTP before reporting success.
#
# Usage:   ./tools/start.sh [port]        # default 8765
set -u

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8765}"
PID_FILE="$SITE_DIR/tools/.server.pid"
LOG_FILE="$SITE_DIR/tools/.server.log"

log() { printf "start.sh: %s\n" "$*"; }
die() { printf "start.sh: ERROR: %s\n" "$*" >&2; exit 1; }

pids_on_port() { lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null; }
is_ours() { ps -p "$1" -o command= 2>/dev/null | grep -q "serve\.py"; }
cmd_of()   { ps -p "$1" -o command= 2>/dev/null | head -c 100; }
healthy()  { curl -sf -o /dev/null --max-time 2 "http://127.0.0.1:$PORT/"; }
wait_port_free() {
  local i
  for i in $(seq 1 50); do [[ -z "$(pids_on_port)" ]] && return 0; sleep 0.1; done
  return 1
}

cd "$SITE_DIR" || die "cannot cd to $SITE_DIR"

# 1. already running (and it's ours, and it answers)?
if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null)"
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null && is_ours "$PID" && healthy; then
    log "already running (pid $PID) → http://127.0.0.1:$PORT/ — nothing to do"
    exit 0
  fi
  rm -f "$PID_FILE"   # stale pid file (crashed/replaced server)
fi

# 2. port occupied? evict whoever holds it
PIDS="$(pids_on_port)"
if [[ -n "$PIDS" ]]; then
  while read -r P; do
    [[ -z "$P" ]] && continue
    if is_ours "$P"; then
      log "port $PORT held by a stale serve.py (pid $P) — stopping it"
    else
      log "port $PORT held by a foreign process — pid $P: $(cmd_of "$P") — evicting it"
    fi
    kill "$P" 2>/dev/null
  done <<< "$PIDS"
  if ! wait_port_free; then
    log "still listening after SIGTERM — sending SIGKILL"
    pids_on_port | while read -r P; do [[ -n "$P" ]] && kill -9 "$P" 2>/dev/null; done
    wait_port_free || die "cannot free port $PORT — free it manually: lsof -i tcp:$PORT"
  fi
  log "port $PORT released"
fi

# 3. start, remember the pid, wait for health
nohup python3 tools/serve.py "$PORT" >> "$LOG_FILE" 2>&1 &
NEW_PID=$!
echo "$NEW_PID" > "$PID_FILE"

for i in $(seq 1 50); do healthy && break; sleep 0.1; done
healthy || { tail -5 "$LOG_FILE" >&2; rm -f "$PID_FILE"; die "server did not come up (log: $LOG_FILE)"; }
log "server up (pid $NEW_PID) → http://127.0.0.1:$PORT/   (pid: $PID_FILE, log: $LOG_FILE)"
