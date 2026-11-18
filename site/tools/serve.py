#!/usr/bin/env python3
"""serve.py — dev server for CT-AI Studio.

A plain http.server with one deviation: every response carries
`Cache-Control: no-store`, so edited JS/CSS is picked up on reload instead of
being served stale from the browser heuristic cache (which bit us during the
Phase C iterations). Static files are otherwise served untouched, so the app
behaves identically to any other static host — and to file://.

Usage (from site/):   python3 tools/serve.py [port]     # default 8765
"""
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler
from functools import partial


class NoStoreHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):  # quieter: one line per request, no stderr spam
        sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    srv = HTTPServer(("127.0.0.1", port), partial(NoStoreHandler, directory="."))
    print("CT-AI Studio dev server (no-store) on http://127.0.0.1:%d/ — Ctrl+C to stop" % port)
    srv.serve_forever()


if __name__ == "__main__":
    main()
