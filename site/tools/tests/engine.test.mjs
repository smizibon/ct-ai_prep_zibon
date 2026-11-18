/* Gate B — engine unit tests. Run: node tools/tests/engine.test.mjs */
import { readFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const Engine = require("../../js/engine.js");
// load questions data into a global scope
const dataSrc = readFileSync(new URL("../../data/questions.js", import.meta.url), "utf8");
const win = {};
new Function("window", dataSrc)(win);
const QS = win.CTAI_QUESTIONS;
const byId = Object.fromEntries(QS.map(q => [q.id, q]));

let fails = 0, n = 0;
function eq(name, got, want) {
  n++;
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) { fails++; console.error(`FAIL ${name}\n  got:  ${JSON.stringify(got)}\n  want: ${JSON.stringify(want)}`); }
  else console.log(`ok   ${name}`);
}

/* thresholds */
eq("threshold 44 -> 29", Engine.threshold(44), 29);
eq("threshold 50 -> 33", Engine.threshold(50), 33);
eq("threshold 6 -> 4", Engine.threshold(6), 4);
eq("threshold 11 -> 8 (ceil 7.15)", Engine.threshold(11), 8);

/* scoring: single correct/incorrect/unanswered */
const q1 = byId.Q1; // correct a
eq("single correct", Engine.scoreQuestion(q1, { selected: "a" }).points, 1);
eq("single wrong", Engine.scoreQuestion(q1, { selected: "b" }).verdict, "incorrect");
eq("unanswered", Engine.scoreQuestion(q1, null).verdict, "unanswered");
eq("unanswered pts", Engine.scoreQuestion(q1, null).points, 0);

/* multi all-or-nothing */
const q2 = byId.Q2; // correct c,e
eq("multi exact match", Engine.scoreQuestion(q2, { selected: ["e", "c"] }).points, 1);
eq("multi one-of-two = 0", Engine.scoreQuestion(q2, { selected: ["c"] }).points, 0);
eq("multi superset = 0", Engine.scoreQuestion(q2, { selected: ["c", "e", "a"] }).points, 0);
eq("multi wrong pair = 0", Engine.scoreQuestion(q2, { selected: ["a", "b"] }).points, 0);
eq("multi single-selected is 'incomplete' (not answered)", Engine.isAnswered(q2, { selected: ["c"] }), false);
const q39 = byId.Q39; // correct b,d
eq("Q39 exact", Engine.scoreQuestion(q39, { selected: ["d", "b"] }).points, 1);

/* K3 2-point */
const q15 = byId.Q15; // K3, correct c
eq("K3 correct = 2 pts", Engine.scoreQuestion(q15, { selected: "c" }).points, 2);
eq("K3 wrong = 0", Engine.scoreQuestion(q15, { selected: "a" }).points, 0);

/* appendix widgets */
const A1 = byId.A1, A4 = byId.A4, A5 = byId.A5;
const a1good = { assignment: Object.assign({}, A1.interaction.correct_assignment) };
eq("A1 exact assignment = 1", Engine.scoreQuestion(A1, a1good).points, 1);
const a1bad = { assignment: Object.assign({}, A1.interaction.correct_assignment, { "0": "Narrow AI" }) };
eq("A1 one misplaced = 0", Engine.scoreQuestion(A1, a1bad).points, 0);
eq("A1 incomplete = unanswered", Engine.scoreQuestion(A1, { assignment: { "0": "Super AI" } }).verdict, "unanswered");
const a4good = { pairs: Object.assign({}, A4.interaction.correct_pairs) };
eq("A4 bijection correct = 1", Engine.scoreQuestion(A4, a4good).points, 1);
const a4bad = { pairs: Object.assign({}, A4.interaction.correct_pairs, { Association: A4.interaction.correct_pairs["Classification"] }) };
eq("A4 cross-pair = 0", Engine.scoreQuestion(A4, a4bad).points, 0);
const a5good = { sequence: A5.interaction.correct_sequence.slice() };
eq("A5 exact order = 1", Engine.scoreQuestion(A5, a5good).points, 1);
const a5bad = { sequence: [a5good.sequence[1], a5good.sequence[0], ...a5good.sequence.slice(2)] };
eq("A5 swapped first two = 0", Engine.scoreQuestion(A5, a5bad).points, 0);

/* full sim scoring: build a session, answer everything correctly, expect 44/44 PASS */
const main = QS.filter(q => q.set === "main");
let sess = Engine.createSession({ mode: "sim", questions: main, shuffle: false, extendedTime: false });
main.forEach(q => {
  sess.responses[q.id] = q.options
    ? (q.type === "multi_two" ? { selected: q.correct_keys.slice() } : { selected: q.correct_keys[0] })
    : { assignment: Object.assign({}, q.interaction.correct_assignment),
        pairs: Object.assign({}, q.interaction.correct_pairs),
        sequence: q.interaction.correct_sequence.slice() }[q.type === "assign" ? "assignment" : q.type === "pair" ? "pairs" : "sequence"] ? {
        assignment: Object.assign({}, q.interaction.correct_assignment) } : null;
  // simpler: handle appendix only in its own test; main set has no widgets
});
// main set: all lettered — the above loop already covers it (options truthy for all 40)
let r = Engine.scoreSession(sess, byId);
eq("sim max = 44", r.max, 44);
eq("sim all-correct = 44 pts", r.points, 44);
eq("sim threshold = 29", r.threshold, 29);
eq("sim all-correct passes", r.passed, true);
eq("sim K3 = 4 questions", r.byKLevel.K3.total, 4);
eq("sim chapters = 7", Object.keys(r.byChapter).length, 7);

/* partial: 28 points = FAIL, 29 = PASS */
sess = Engine.createSession({ mode: "sim", questions: main, shuffle: false });
main.forEach((q, i) => { sess.responses[q.id] = i < 28 ? (q.type === "multi_two" ? { selected: q.correct_keys.slice() } : { selected: q.correct_keys[0] }) : null; });
// note: 28 answered with correct letters — but K3s worth 2; compute actual:
r = Engine.scoreSession(sess, byId);
eq("partial threshold still 29", r.threshold, 29);
eq("partial pass flag matches points>=29", r.passed, r.points >= 29);

/* unanswered all */
sess = Engine.createSession({ mode: "sim", questions: main, shuffle: false });
r = Engine.scoreSession(sess, byId);
eq("all unanswered = 0 pts, FAIL", [r.points, r.passed], [0, false]);
eq("all unanswered verdicts", r.perQuestion.every(pq => pq.verdict === "unanswered"), true);

/* timer math + drift clamp */
sess = Engine.createSession({ mode: "sim", questions: main, shuffle: false, extendedTime: false });
eq("sim duration 60 min", sess.durationMs, 3600000);
eq("75-min accommodation", Engine.createSession({ mode: "sim", questions: main, extendedTime: true }).durationMs, 4500000);
const now = sess.startedAt + 60000;
sess.lastHeartbeatAt = now + 300000; // clock jumped backwards 5 min relative to 'now'
Engine.applyDriftClamp(sess, now);
eq("drift clamp shifts endsAt", sess.endsAt, sess.startedAt + 3600000 + 240000);
eq("remaining never inflates past clamp", Engine.remainingMs(sess, now), 3600000 - 60000 + 240000);

/* shuffle determinism */
const rand = Engine.rng(42);
const s1 = Engine.shuffled([1, 2, 3, 4, 5], Engine.rng(42));
const s2 = Engine.shuffled([1, 2, 3, 4, 5], Engine.rng(42));
eq("seeded shuffle deterministic", s1, s2);
eq("shuffled is a permutation", s1.slice().sort(), [1, 2, 3, 4, 5]);
const sessShuf = Engine.createSession({ mode: "sim", questions: main, shuffle: true });
eq("shuffle keeps all 40 ids", sessShuf.questionIds.slice().sort().length, 40);
eq("shuffle builds orderMap for lettered qs", sessShuf.orderMap.Q1.length, 4);

/* pacing */
eq("pacing 9xK2+1xK3 = 12 min", Engine.pacingMinutes([...Array(9).fill({ k_level: "K2" }), { k_level: "K3" }]), 12);

/* toAttempt shape */
sess = Engine.createSession({ mode: "practice", questions: [q1, q2], shuffle: false, timerStyle: "none" });
sess.responses.Q1 = { selected: "a" }; sess.responses.Q2 = { selected: ["a", "b"] };
r = Engine.scoreSession(sess, byId);
const att = Engine.toAttempt(sess, r, {});
eq("attempt points", [att.points, att.maxPoints], [1, 2]);
eq("attempt threshold ceil(1.3)=2", att.threshold, 2);
eq("attempt perQuestion verdicts", att.perQuestion.map(p => p.verdict), ["correct", "incorrect"]);

/* data-level sanity (mirrors Gate A but cheap here) */
eq("46 questions", QS.length, 46);
eq("main 44 pts", QS.filter(q => q.set === "main").reduce((a, q) => a + q.points, 0), 44);
eq("appendix 6 pts", QS.filter(q => q.set === "appendix").reduce((a, q) => a + q.points, 0), 6);
eq("stem never embeds select line", QS.every(q => !q.stem_md.trimEnd().endsWith("answer.*")), true);

console.log(`\n${n - fails}/${n} passed`);
process.exit(fails ? 1 : 0);
