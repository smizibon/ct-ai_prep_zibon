/* store.js — localStorage wrapper, settings, progress, sessions, attempts, qstats (D2 §4, SPEC §1/§6D) */
(function () {
  "use strict";
  var KEYS = {
    progress: "ctai.progress.v1",
    session: "ctai.session.v1",
    attempts: "ctai.attempts.v1",
    qstats: "ctai.qstats.v1",
    settings: "ctai.settings.v1"
  };
  var available = true;
  try { localStorage.setItem("ctai.probe", "1"); localStorage.removeItem("ctai.probe"); }
  catch (e) { available = false; }

  function read(k, dflt) {
    if (!available) return dflt;
    try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : dflt; }
    catch (e) { return dflt; }
  }
  function write(k, v) {
    if (!available) return false;
    try { localStorage.setItem(k, JSON.stringify(v)); return true; }
    catch (e) { return false; }
  }

  var settings = Object.assign(
    { theme: "auto", extendedTime: false, shuffleDefault: false, reduceMotion: "auto", celebratedPass: false },
    read(KEYS.settings, {}));
  function saveSettings() { write(KEYS.settings, settings); }

  function getProgress() { return read(KEYS.progress, {}); }
  function setUnderstood(subId, on) {
    var p = getProgress();
    if (on) p[subId] = { understood: true, ts: Date.now() };
    else delete p[subId];
    write(KEYS.progress, p);
  }

  function getSession() { return read(KEYS.session, null); }
  function saveSession(s) { return write(KEYS.session, s); }
  function clearSession() { if (available) localStorage.removeItem(KEYS.session); }

  function getAttempts() { return read(KEYS.attempts, []); }
  function pushAttempt(a) {
    var list = getAttempts();
    list.unshift(a);
    if (list.length > 50) list.length = 50;
    write(KEYS.attempts, list);
  }
  function findAttempt(id) {
    return getAttempts().find(function (a) { return a.sessionId === id; }) || null;
  }

  function getQStats() { return read(KEYS.qstats, {}); }
  function foldQStats(perQuestion, firstAttemptIds) {
    var s = getQStats();
    perQuestion.forEach(function (pq) {
      if (firstAttemptIds && !firstAttemptIds.includes(pq.id)) return;
      var e = s[pq.id] || { seen: 0, correct: 0, incorrect: 0 };
      e.seen++; if (pq.verdict === "correct") e.correct++; else if (pq.verdict === "incorrect") e.incorrect++;
      e.lastVerdict = pq.verdict; e.lastAttemptAt = Date.now();
      s[pq.id] = e;
    });
    write(KEYS.qstats, s);
  }
  function weakAreas() {
    var s = getQStats(), byCh = {}, out = [];
    Object.keys(s).forEach(function (qid) {
      var e = s[qid];
      if (e.seen >= 2 && e.correct / e.seen < 0.6) {
        var q = (window.CTAI_QUESTIONS || []).find(function (x) { return x.id === qid; });
        if (q) { byCh[q.chapter] = byCh[q.chapter] || { seen: 0, correct: 0 }; byCh[q.chapter].seen++; byCh[q.chapter].correct += (e.lastVerdict === "correct" ? 1 : 0); }
        if (e.incorrect >= 2) out.push({ type: "question", id: qid, incorrect: e.incorrect });
      }
    });
    Object.keys(byCh).forEach(function (ch) {
      var c = byCh[ch];
      if (c.seen >= 2 && c.correct / c.seen < 0.6) out.unshift({ type: "chapter", n: Number(ch), seen: c.seen, correct: c.correct });
    });
    return out;
  }

  function resetAll() {
    if (!available) return;
    Object.values(KEYS).forEach(function (k) { localStorage.removeItem(k); });
  }

  window.Store = {
    available: available,
    KEYS: KEYS,
    settings: settings, saveSettings: saveSettings,
    getProgress: getProgress, setUnderstood: setUnderstood,
    getSession: getSession, saveSession: saveSession, clearSession: clearSession,
    getAttempts: getAttempts, pushAttempt: pushAttempt, findAttempt: findAttempt,
    getQStats: getQStats, foldQStats: foldQStats, weakAreas: weakAreas,
    resetAll: resetAll
  };
})();
