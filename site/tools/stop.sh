#!/bin/bash
# stop.sh — stop the CT-AI Studio dev server cleanly.
#
# Targets ONLY our server: the pid recorded by start.sh, or (fallback) any
# process on the port whose command line contains serve.py. A foreign process
# squatting the port is reported, never killed — start.sh is the one that evicts.
# Verifies the port is actually free before reporting success.
#
# Usage:   ./tools/stop.sh [port]        # default 8765
set -u

SITE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-8765}"
PID_FILE="$SITE_DIR/tools/.server.pid"

log() { printf "stop.sh: %s\n" "$*"; }
die() { printf "stop.sh: ERROR: %s\n" "$*" >&2; exit 1; }

pids_on_port() { lsof -ti tcp:"$PORT" -sTCP:LISTEN 2>/dev/null; }
is_ours() { ps -p "$1" -o command= 2>/dev/null | grep -q "serve\.py"; }
cmd_of()   { ps -p "$1" -o command= 2>/dev/null | head -c 100; }
port_free() { [[ -z "$(pids_on_port)" ]]; }

STOPPED=0

# 1. recorded pid first
if [[ -f "$PID_FILE" ]]; then
  PID="$(cat "$PID_FILE" 2>/dev/null)"
  if [[ -n "${PID:-}" ]] && kill -0 "$PID" 2>/dev/null; then
    if is_ours "$PID"; then
      kill "$PID" 2>/dev/null && { log "stopped serve.py (pid $PID)"; STOPPED=1; }
    else
      log "recorded pid $PID no longer belongs to serve.py ($(cmd_of "$PID")) — not touching it"
    fi
  fi
  rm -f "$PID_FILE"
fi

# 2. fallback: any serve.py still on the port
for P in $(pids_on_port); do
  if is_ours "$P"; then
    kill "$P" 2>/dev/null && { log "stopped leftover serve.py (pid $P)"; STOPPED=1; }
  else
    log "port $PORT still held by a foreign process (pid $P: $(cmd_of "$P")) — leaving it alone"
  fi
done

# 3. brief grace, then verify (kill -9 only our stragglers)
for i in $(seq 1 30); do port_free && break; sleep 0.1; done
for P in $(pids_on_port); do is_ours "$P" && kill -9 "$P" 2>/dev/null; done
for i in $(seq 1 20); do port_free && break; sleep 0.1; done

port_free || die "port $PORT is still occupied (see: lsof -i tcp:$PORT)"
if [[ "$STOPPED" -eq 1 ]]; then
  log "port $PORT free — server stopped"
else
  log "port $PORT free — no server of ours was running"
fi
exit 0
