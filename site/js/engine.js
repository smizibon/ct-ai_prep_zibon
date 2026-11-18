/* engine.js — exam session logic: creation, scoring, thresholds, timer (D2 §3–4, SPEC §6D).
 * Pure functions on data objects; no DOM. Testable under node. */
(function () {
  "use strict";
  var Engine = {};

  /* ---- seeded shuffle (deterministic per attempt) ---- */
  Engine.rng = function (seed) {
    var s = seed >>> 0 || 1;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  };
  Engine.shuffled = function (arr, rand) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  /* ---- threshold: official 65% rule, ceil — reproduces 29@44, 33@50, 4@6 ---- */
  Engine.threshold = function (maxPoints) { return Math.ceil(0.65 * maxPoints); };

  /* ---- session creation ---- */
  Engine.SIM_MINUTES = 60;
  Engine.createSession = function (opts) {
    // opts: {mode: 'sim'|'practice'|'appendix'|'quick', questions: [...], shuffle: bool,
    //        extendedTime: bool, timerStyle: 'countdown'|'countup'|'none', checkMode: 'instant'|'at_end',
    //        durationMin: number (quick pacing / overrides)}
    var qs = opts.questions;
    var orderMap = null, order = qs.map(function (q) { return q.id; });
    if (opts.shuffle) {
      var seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
      var rand = Engine.rng(seed);
      order = Engine.shuffled(order, rand);
      orderMap = {};
      qs.forEach(function (q) {
        var keys = q.options ? q.options.map(function (o) { return o.key; }) : null;
        orderMap[q.id] = keys ? Engine.shuffled(keys, rand) : null;
      });
      qs = order.map(function (id) { return qs.find(function (q) { return q.id === id; }); });
    }
    var maxPoints = qs.reduce(function (a, q) { return a + q.points; }, 0);
    var s = {
      mode: opts.mode,
      sessionId: "s-" + Date.now().toString(36) + "-" + Math.floor(Math.random() * 1e6).toString(36),
      questionIds: order, orderMap: orderMap,
      responses: {}, flags: {}, checked: {},
      startedAt: Date.now(),
      timerStyle: opts.timerStyle || (opts.mode === "sim" ? "countdown" : "countup"),
      checkMode: opts.checkMode || (opts.mode === "sim" ? "at_end" : "instant"),
      threshold: Engine.threshold(maxPoints), maxPoints: maxPoints,
      uiState: { currentIndex: 0 },
      lastHeartbeatAt: Date.now(),
      seed: opts.shuffle ? seed : null,
      finished: false
    };
    if (s.timerStyle === "countdown") {
      var min = opts.durationMin != null ? opts.durationMin :
        (opts.mode === "sim" ? Engine.SIM_MINUTES * (opts.extendedTime ? 1.25 : 1) : Engine.pacingMinutes(qs));
      s.durationMs = min * 60000;
      s.endsAt = s.startedAt + s.durationMs;
    }
    return s;
  };
  Engine.pacingMinutes = function (qs) {
    return qs.reduce(function (a, q) { return a + (q.k_level === "K3" ? 3 : 1); }, 0);
  };

  /* ---- response validity / completeness ---- */
  Engine.isAnswered = function (q, resp) {
    if (!resp) return false;
    if (q.type === "multi_two") return Array.isArray(resp.selected) && resp.selected.length === 2;
    if (q.type === "single") return typeof resp.selected === "string";
    if (q.type === "assign") return resp.assignment && Object.keys(resp.assignment).length === (q.interaction.statements || []).length;
    if (q.type === "pair") return resp.pairs && Object.keys(resp.pairs).length === (q.interaction.left || []).length;
    if (q.type === "order") return Array.isArray(resp.sequence) && resp.sequence.length === (q.interaction.items || []).length;
    return false;
  };

  /* ---- scoring (D2 §3.3) ---- */
  Engine.scoreQuestion = function (q, resp) {
    if (!resp || !Engine.isAnswered(q, resp)) {
      return { points: 0, verdict: Engine.isAnswered(q, resp) ? null : "unanswered" };
    }
    var ok;
    switch (q.type) {
      case "single": ok = resp.selected === q.correct_keys[0]; break;
      case "multi_two":
        ok = resp.selected.slice().sort().join(",") === q.correct_keys.slice().sort().join(","); break;
      case "assign":
        ok = JSON.stringify(Object.keys(q.interaction.correct_assignment).sort().map(function (k) { return k + ":" + q.interaction.correct_assignment[k]; })) ===
             JSON.stringify(Object.keys(resp.assignment).sort().map(function (k) { return k + ":" + resp.assignment[k]; })); break;
      case "pair":
        ok = JSON.stringify(q.interaction.left.map(function (l) { return l + ">" + q.interaction.correct_pairs[l]; }).sort()) ===
             JSON.stringify(Object.keys(resp.pairs).map(function (l) { return l + ">" + resp.pairs[l]; }).sort()); break;
      case "order":
        ok = resp.sequence.join("\u0001") === q.interaction.correct_sequence.join("\u0001"); break;
      default: ok = false;
    }
    return { points: ok ? q.points : 0, verdict: ok ? "correct" : "incorrect" };
  };

  Engine.scoreSession = function (session, questionsById) {
    var r = { perQuestion: [], points: 0, max: 0, byChapter: {}, byKLevel: {} };
    session.questionIds.forEach(function (id) {
      var q = questionsById[id];
      var s = Engine.scoreQuestion(q, session.responses[id]);
      r.perQuestion.push({ id: id, chapter: q.chapter, k: q.k_level, points: s.points, max: q.points,
        verdict: s.verdict || "unanswered", flagged: !!session.flags[id] });
      r.points += s.points; r.max += q.points;
      var c = r.byChapter[q.chapter] = r.byChapter[q.chapter] || { points: 0, max: 0, correct: 0, total: 0 };
      c.points += s.points; c.max += q.points; c.total++; if (s.verdict === "correct") c.correct++;
      var k = r.byKLevel[q.k_level] = r.byKLevel[q.k_level] || { points: 0, max: 0, correct: 0, total: 0 };
      k.points += s.points; k.max += q.points; k.total++; if (s.verdict === "correct") k.correct++;
    });
    r.threshold = Engine.threshold(r.max);
    r.passed = r.points >= r.threshold;
    return r;
  };

  /* ---- timer helpers ---- */
  Engine.remainingMs = function (session, now) {
    if (!session.endsAt) return null;
    return Math.max(0, session.endsAt - (now || Date.now()));
  };
  Engine.applyDriftClamp = function (session, now) {
    // if wall clock moved backwards >60s since the heartbeat, shift endsAt so remaining time cannot inflate
    now = now || Date.now();
    var delta = session.lastHeartbeatAt - now;
    if (session.endsAt && delta > 60000) {
      session.endsAt += delta - 60000;
    }
    session.lastHeartbeatAt = now;
    return session;
  };

  /* ---- archive to attempt ---- */
  Engine.toAttempt = function (session, result, opts) {
    return {
      sessionId: session.sessionId, mode: session.mode,
      startedAt: session.startedAt, submittedAt: Date.now(),
      timeUsedMs: opts && opts.timeUsedMs != null ? opts.timeUsedMs :
        (session.endsAt ? Math.min(session.durationMs, Date.now() - session.startedAt) : Date.now() - session.startedAt),
      autoSubmitted: !!(opts && opts.autoSubmitted),
      points: result.points, maxPoints: result.max, threshold: result.threshold, passed: result.passed,
      shuffle: !!session.orderMap,
      questionIds: session.questionIds,
      perQuestion: result.perQuestion.map(function (pq) {
        return { id: pq.id, verdict: pq.verdict, points: pq.points, selected: (session.responses[pq.id] || null), flagged: pq.flagged };
      }),
      byChapter: result.byChapter, byKLevel: result.byKLevel
    };
  };

  if (typeof window !== "undefined") window.Engine = Engine;
  if (typeof module !== "undefined") module.exports = Engine;
})();
