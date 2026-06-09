"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeIn } from "@/components/ui/motion-wrapper";
import { Trophy, Zap, RefreshCw, Clock, CheckCircle2, XCircle, ChevronRight } from "lucide-react";

/* ─────────────────────────────────────────────
   GAME 1: SQL Bug Hunt
   Show a broken query. Click the line with the bug.
───────────────────────────────────────────────── */

type BugLevel = {
  title: string;
  description: string;
  lines: string[];
  bugLine: number; // 0-indexed
  explanation: string;
};

const bugLevels: BugLevel[] = [
  {
    title: "The Invisible Churn",
    description: "This query calculates monthly churn MRR. It returns $0 every month. Why?",
    lines: [
      "SELECT",
      "  DATE_TRUNC('month', end_date) AS month,",
      "  SUM(mrr_amount) AS churn_mrr",
      "FROM subscriptions",
      "WHERE is_active = FALSE",
      "  AND status = 'active'",
      "GROUP BY 1",
      "ORDER BY 1;",
    ],
    bugLine: 5,
    explanation: "Line 6: WHERE status = 'active' contradicts is_active = FALSE. Churned accounts have status = 'churned'. This filter returns zero rows — hence $0 churn every month.",
  },
  {
    title: "The Double Count",
    description: "MRR is 9x higher than reality. This query is the culprit. Find it.",
    lines: [
      "SELECT",
      "  account_id,",
      "  SUM(mrr_amount) AS total_mrr",
      "FROM subscriptions",
      "WHERE churn_flag = FALSE",
      "GROUP BY account_id",
      "ORDER BY total_mrr DESC;",
    ],
    bugLine: 3,
    explanation: "Line 4: Missing filter on is_active = TRUE. When accounts change plans, old subscription rows stay open. Each account has 7-10 active rows — so MRR is multiplied by that factor.",
  },
  {
    title: "Wrong Retention Window",
    description: "This cohort retention query returns impossible values above 100%. Find the error.",
    lines: [
      "SELECT",
      "  cohort_month,",
      "  month_number,",
      "  COUNT(DISTINCT account_id) /",
      "    COUNT(DISTINCT account_id) OVER (PARTITION BY cohort_month)",
      "    AS retention_rate",
      "FROM cohort_activity",
      "ORDER BY cohort_month, month_number;",
    ],
    bugLine: 4,
    explanation: "Line 5: The window function divides by the ENTIRE cohort count, but month_number > 0 can have MORE activity rows than month 0 if accounts are counted more than once. Should be the month_number = 0 count.",
  },
];

function SqlBugHunt() {
  const [level, setLevel] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const current = bugLevels[level % bugLevels.length];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [level, startTimer]);

  const handleSelect = (i: number) => {
    if (revealed || gameOver) return;
    setSelected(i);
    setRevealed(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (i === current.bugLine) {
      const pts = Math.max(10, timeLeft * 3);
      setScore((s) => s + pts);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setLevel((l) => l + 1);
  };

  const restart = () => {
    setSelected(null);
    setRevealed(false);
    setLevel(0);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    startTimer();
  };

  const correct = selected === current.bugLine;

  if (gameOver) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 py-8">
        <Trophy size={40} style={{ color: "#F59E0B" }} />
        <div className="text-center">
          <div className="text-2xl font-bold text-text-1">{score} pts</div>
          <div className="text-sm text-text-3 mt-1">Time ran out — {level} bug{level !== 1 ? "s" : ""} found</div>
        </div>
        <button onClick={restart} className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white" style={{ background: "#3D7BFD" }}>
          <RefreshCw size={14} /> Play again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-text-1">{current.title}</div>
          <div className="text-xs text-text-3 mt-0.5">{current.description}</div>
        </div>
        <div className="flex items-center gap-3">
          {streak > 1 && (
            <div className="flex items-center gap-1 font-mono text-xs" style={{ color: "#F59E0B" }}>
              <Zap size={12} /> {streak}x
            </div>
          )}
          <div className="font-mono text-xs text-text-3">{score} pts</div>
          <div
            className="flex items-center gap-1 font-mono text-xs rounded-md px-2 py-1"
            style={{
              background: timeLeft <= 10 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
              color: timeLeft <= 10 ? "#EF4444" : "rgba(255,255,255,0.5)",
            }}
          >
            <Clock size={11} /> {timeLeft}s
          </div>
        </div>
      </div>

      {/* Query */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "#06070F", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/50" />
          <div className="h-2.5 w-2.5 rounded-full bg-green-500/50" />
          <span className="ml-2 font-mono text-[10px] text-text-3">query.sql</span>
          <span className="ml-auto font-mono text-[10px] text-text-3">click the bug</span>
        </div>
        {current.lines.map((line, i) => {
          const isSelected = selected === i;
          const isBug = i === current.bugLine;
          let bg = "transparent";
          let border = "transparent";
          if (revealed && isBug) { bg = "rgba(34,197,94,0.08)"; border = "rgba(34,197,94,0.25)"; }
          else if (revealed && isSelected && !isBug) { bg = "rgba(239,68,68,0.08)"; border = "rgba(239,68,68,0.25)"; }
          else if (!revealed && isSelected) { bg = "rgba(61,123,253,0.1)"; border = "rgba(61,123,253,0.3)"; }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={revealed}
              className="w-full flex items-center gap-3 px-4 py-1.5 text-left transition-all font-mono text-xs hover:bg-white/[0.03] disabled:cursor-default"
              style={{ background: bg, borderLeft: `2px solid ${border}` }}
            >
              <span className="text-text-3/40 w-4 flex-shrink-0 text-right">{i + 1}</span>
              <span
                className="text-text-2 flex-1"
                style={{ color: revealed && isBug ? "#22C55E" : revealed && isSelected && !isBug ? "#EF4444" : undefined }}
              >
                {line}
              </span>
              {revealed && isBug && <CheckCircle2 size={14} className="flex-shrink-0 text-green-400" />}
              {revealed && isSelected && !isBug && <XCircle size={14} className="flex-shrink-0 text-red-400" />}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-xl p-4"
            style={{
              background: correct ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
              border: `1px solid ${correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}
          >
            <div className="flex-1">
              <div className="text-xs font-semibold mb-1" style={{ color: correct ? "#22C55E" : "#EF4444" }}>
                {correct ? `+${Math.max(10, timeLeft * 3)} pts — Correct!` : "Not quite — here's why:"}
              </div>
              <div className="text-xs text-text-3 leading-relaxed">{current.explanation}</div>
            </div>
            <button
              onClick={next}
              className="flex-shrink-0 flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
              style={{ background: "#3D7BFD" }}
            >
              Next <ChevronRight size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GAME 2: Data Detective — flag dirty rows
───────────────────────────────────────────────── */

type DataRow = {
  id: string;
  account: string;
  mrr: string;
  status: string;
  start_date: string;
  is_active: string;
  issue?: string;
};

const dataRows: DataRow[] = [
  { id: "A001", account: "Acme Corp", mrr: "$1,200", status: "active", start_date: "2023-01-15", is_active: "TRUE" },
  { id: "A002", account: "Beta LLC", mrr: "$0", status: "active", start_date: "2023-02-01", is_active: "TRUE", issue: "Zero MRR on active account" },
  { id: "A003", account: "Gamma Inc", mrr: "$850", status: "churned", start_date: "2023-03-10", is_active: "TRUE", issue: "Churned but is_active = TRUE" },
  { id: "A004", account: "Delta Co", mrr: "$2,100", status: "active", start_date: "2023-01-05", is_active: "TRUE" },
  { id: "A005", account: "Delta Co", mrr: "$2,100", status: "active", start_date: "2023-01-05", is_active: "TRUE", issue: "Duplicate row" },
  { id: "A006", account: "Echo Ltd", mrr: "-$500", status: "active", start_date: "2023-04-20", is_active: "TRUE", issue: "Negative MRR on active account" },
  { id: "A007", account: "Foxtrot AB", mrr: "$3,400", status: "active", start_date: "2023-01-01", is_active: "TRUE" },
  { id: "A008", account: "", mrr: "$670", status: "active", start_date: "2023-05-01", is_active: "TRUE", issue: "NULL account name" },
];

function DataDetective() {
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(45);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dirty = dataRows.filter((r) => r.issue).map((r) => r.id);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setSubmitted(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const toggle = (id: string) => {
    if (submitted) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
  };

  const restart = () => {
    setFlagged(new Set());
    setSubmitted(false);
    setTimeLeft(45);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); setSubmitted(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const truePos = [...flagged].filter((id) => dirty.includes(id)).length;
  const falsePos = [...flagged].filter((id) => !dirty.includes(id)).length;
  const missed = dirty.filter((id) => !flagged.has(id)).length;
  const score = Math.max(0, truePos * 25 - falsePos * 10);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-text-1">Data Detective</div>
          <div className="text-xs text-text-3 mt-0.5">Click every dirty row. Flag duplicates, nulls, wrong states, impossible values.</div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-1 font-mono text-xs rounded-md px-2 py-1"
            style={{
              background: timeLeft <= 10 ? "rgba(239,68,68,0.12)" : "rgba(255,255,255,0.05)",
              color: timeLeft <= 10 ? "#EF4444" : "rgba(255,255,255,0.5)",
            }}
          >
            <Clock size={11} /> {timeLeft}s
          </div>
          {!submitted && (
            <button
              onClick={handleSubmit}
              className="rounded-lg px-3 py-1 text-xs font-semibold text-white"
              style={{ background: "#3D7BFD" }}
            >
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="grid font-mono text-[10px] uppercase tracking-wider text-text-3 px-4 py-2"
          style={{
            gridTemplateColumns: "40px 1fr 80px 80px 100px 60px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "#06070F",
          }}
        >
          <span>id</span><span>account</span><span>mrr</span><span>status</span><span>start_date</span><span>active</span>
        </div>
        {dataRows.map((row) => {
          const isFlagged = flagged.has(row.id);
          const isDirty = !!row.issue;
          let rowBg = "transparent";
          if (submitted) {
            if (isDirty && isFlagged) rowBg = "rgba(34,197,94,0.08)";
            else if (isDirty && !isFlagged) rowBg = "rgba(239,68,68,0.06)";
            else if (!isDirty && isFlagged) rowBg = "rgba(239,68,68,0.08)";
          } else if (isFlagged) {
            rowBg = "rgba(245,158,11,0.08)";
          }

          return (
            <button
              key={row.id}
              onClick={() => toggle(row.id)}
              disabled={submitted}
              className="w-full grid items-center px-4 py-2.5 text-left transition-all font-mono text-xs border-b border-white/[0.04] hover:bg-white/[0.03] disabled:cursor-default"
              style={{
                gridTemplateColumns: "40px 1fr 80px 80px 100px 60px",
                background: rowBg,
                borderLeft: isFlagged ? "2px solid #F59E0B" : "2px solid transparent",
              }}
            >
              <span className="text-text-3">{row.id}</span>
              <span className="text-text-2 truncate pr-2">{row.account || <span className="italic text-red-400/70">NULL</span>}</span>
              <span className={row.mrr.startsWith("-") ? "text-red-400" : "text-text-2"}>{row.mrr}</span>
              <span className={row.status === "churned" ? "text-orange-400" : "text-text-2"}>{row.status}</span>
              <span className="text-text-3">{row.start_date}</span>
              <span className="text-text-2">{row.is_active}</span>
            </button>
          );
        })}
      </div>

      {/* Results */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 flex items-start gap-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div className="rounded-lg p-3" style={{ background: "rgba(34,197,94,0.08)" }}>
                <div className="font-mono text-xs text-green-400 mb-0.5">Caught</div>
                <div className="text-xl font-bold text-green-400">{truePos}<span className="text-sm text-green-400/60">/{dirty.length}</span></div>
              </div>
              <div className="rounded-lg p-3" style={{ background: "rgba(239,68,68,0.08)" }}>
                <div className="font-mono text-xs text-red-400 mb-0.5">False flags</div>
                <div className="text-xl font-bold text-red-400">{falsePos}</div>
              </div>
              <div className="rounded-lg p-3 col-span-2" style={{ background: "rgba(61,123,253,0.08)" }}>
                <div className="font-mono text-xs text-blue-400 mb-0.5">Score</div>
                <div className="text-2xl font-bold text-text-1">{score} pts</div>
                {missed > 0 && <div className="text-xs text-text-3 mt-1">Missed {missed} dirty row{missed !== 1 ? "s" : ""}</div>}
              </div>
            </div>
            <button onClick={restart} className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white flex-shrink-0" style={{ background: "#3D7BFD" }}>
              <RefreshCw size={12} /> Retry
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GAME 3: MRR Classifier — drag/click to bucket
───────────────────────────────────────────────── */

type MRREvent = {
  id: string;
  description: string;
  amount: string;
  correct: "new" | "expansion" | "contraction" | "churn";
};

const mrrEvents: MRREvent[] = [
  { id: "e1", description: "Acme Corp signs up for the first time — $800/mo plan", amount: "+$800", correct: "new" },
  { id: "e2", description: "Beta LLC upgrades from $500 to $1,200/mo", amount: "+$700", correct: "expansion" },
  { id: "e3", description: "Gamma Inc cancels their $1,400/mo subscription", amount: "-$1,400", correct: "churn" },
  { id: "e4", description: "Delta Co downgrades from $2,000 to $900/mo", amount: "-$1,100", correct: "contraction" },
  { id: "e5", description: "Echo Ltd signs a new $3,000/mo enterprise contract", amount: "+$3,000", correct: "new" },
  { id: "e6", description: "Foxtrot AB adds 5 seats to existing $400/mo plan", amount: "+$200", correct: "expansion" },
  { id: "e7", description: "Golf Corp pauses then cancels their $650/mo account", amount: "-$650", correct: "churn" },
  { id: "e8", description: "Hotel Inc reduces from 20 seats to 8 seats", amount: "-$480", correct: "contraction" },
];

const buckets = [
  { id: "new", label: "New MRR", color: "#22C55E", desc: "First-time revenue" },
  { id: "expansion", label: "Expansion", color: "#3D7BFD", desc: "Existing account upgrades" },
  { id: "contraction", label: "Contraction", color: "#F59E0B", desc: "Existing account downgrades" },
  { id: "churn", label: "Churn", color: "#EF4444", desc: "Cancellations" },
] as const;

function MRRClassifier() {
  const [classified, setClassified] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const event = mrrEvents[currentIdx];
  const isLast = currentIdx >= mrrEvents.length - 1;
  const done = submitted || (currentIdx >= mrrEvents.length);

  const classify = (bucketId: string) => {
    if (done) return;
    const correct = event.correct === bucketId;
    if (correct) {
      setScore((s) => s + 20 + streak * 5);
      setStreak((s) => s + 1);
    } else {
      setStreak(0);
    }
    setClassified((prev) => ({ ...prev, [event.id]: bucketId }));
    if (isLast) {
      setSubmitted(true);
    } else {
      setTimeout(() => setCurrentIdx((i) => i + 1), 600);
    }
  };

  const restart = () => {
    setClassified({});
    setSubmitted(false);
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
  };

  const correctCount = Object.entries(classified).filter(([id, bucket]) => {
    const ev = mrrEvents.find((e) => e.id === id);
    return ev?.correct === bucket;
  }).length;

  if (done) {
    return (
      <div className="flex flex-col gap-4">
        <div className="text-sm font-semibold text-text-1">Results</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4 col-span-2" style={{ background: "rgba(61,123,253,0.08)", border: "1px solid rgba(61,123,253,0.2)" }}>
            <div className="text-3xl font-bold text-text-1">{score} pts</div>
            <div className="text-sm text-text-3 mt-1">{correctCount}/{mrrEvents.length} correct · max streak: {streak}</div>
          </div>
          {mrrEvents.map((ev) => {
            const chosen = classified[ev.id];
            const correct = chosen === ev.correct;
            return (
              <div
                key={ev.id}
                className="rounded-lg p-3"
                style={{
                  background: correct ? "rgba(34,197,94,0.07)" : "rgba(239,68,68,0.07)",
                  border: `1px solid ${correct ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
                }}
              >
                <div className="text-xs text-text-3 leading-snug mb-1.5">{ev.description}</div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold" style={{ color: correct ? "#22C55E" : "#EF4444" }}>
                    {buckets.find((b) => b.id === chosen)?.label ?? "—"}
                  </span>
                  {!correct && (
                    <>
                      <span className="text-text-3/40 text-xs">→</span>
                      <span className="font-mono text-xs" style={{ color: "#22C55E" }}>
                        {buckets.find((b) => b.id === ev.correct)?.label}
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={restart} className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white" style={{ background: "#3D7BFD" }}>
          <RefreshCw size={14} /> Play again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-text-1">MRR Classifier</div>
          <div className="text-xs text-text-3 mt-0.5">Classify each revenue event. Build the waterfall.</div>
        </div>
        <div className="flex items-center gap-2">
          {streak > 1 && (
            <div className="flex items-center gap-1 font-mono text-xs" style={{ color: "#F59E0B" }}>
              <Zap size={12} /> {streak}x streak
            </div>
          )}
          <div className="font-mono text-xs text-text-3">
            {currentIdx + 1}/{mrrEvents.length}
          </div>
          <div className="font-mono text-xs text-text-3">{score} pts</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: "#3D7BFD" }}
          animate={{ width: `${((currentIdx) / mrrEvents.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Event card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={event.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-xl p-5 text-center"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div className="text-2xl font-bold mb-2" style={{ color: event.amount.startsWith("+") ? "#22C55E" : "#EF4444" }}>
            {event.amount}
          </div>
          <div className="text-sm text-text-2 leading-relaxed">{event.description}</div>
        </motion.div>
      </AnimatePresence>

      {/* Buckets */}
      <div className="grid grid-cols-2 gap-2">
        {buckets.map((bucket) => (
          <button
            key={bucket.id}
            onClick={() => classify(bucket.id)}
            className="rounded-xl p-4 text-left transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: `${bucket.color}10`,
              border: `1px solid ${bucket.color}30`,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${bucket.color}20`; (e.currentTarget as HTMLElement).style.borderColor = `${bucket.color}50`; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = `${bucket.color}10`; (e.currentTarget as HTMLElement).style.borderColor = `${bucket.color}30`; }}
          >
            <div className="text-sm font-semibold mb-0.5" style={{ color: bucket.color }}>{bucket.label}</div>
            <div className="text-xs text-text-3">{bucket.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main section
───────────────────────────────────────────────── */

const gameList = [
  { id: "sql", label: "SQL Bug Hunt", desc: "Find the bug before time runs out", icon: "🔍", color: "#3D7BFD" },
  { id: "data", label: "Data Detective", desc: "Flag every dirty row in the dataset", icon: "🕵️", color: "#0DB8A2" },
  { id: "mrr", label: "MRR Classifier", desc: "Classify revenue events into the waterfall", icon: "📊", color: "#8B5CF6" },
];

export function MiniGames() {
  const [active, setActive] = useState("sql");
  const [keys, setKeys] = useState<Record<string, number>>({ sql: 0, data: 0, mrr: 0 });

  const reset = () => {
    setKeys((prev) => ({ ...prev, [active]: prev[active] + 1 }));
  };

  return (
    <section id="games" className="py-28 bg-surface-1">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <FadeIn className="mb-12">
          <span className="font-mono text-label text-text-3 tracking-widest uppercase">
            Interactive
          </span>
          <div className="mt-3 flex flex-wrap items-end gap-6 justify-between">
            <h2 className="text-display-sm font-bold text-text-1">
              Data Games
            </h2>
            <p className="max-w-sm text-sm text-text-2 leading-relaxed">
              Three mini-games built from real problems in my case studies.
              If you can beat them, you understand data analytics.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Game selector */}
          <div className="flex lg:flex-col gap-3">
            {gameList.map((g) => (
              <button
                key={g.id}
                onClick={() => setActive(g.id)}
                className="flex-1 lg:flex-none flex flex-col items-start gap-1 rounded-2xl p-4 text-left transition-all"
                style={{
                  background: active === g.id ? `${g.color}12` : "rgba(255,255,255,0.03)",
                  border: active === g.id ? `1px solid ${g.color}35` : "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div className="text-lg">{g.icon}</div>
                <div className="text-sm font-semibold text-text-1 leading-snug">{g.label}</div>
                <div className="hidden lg:block text-xs text-text-3 leading-snug">{g.desc}</div>
              </button>
            ))}
            <button
              onClick={reset}
              className="hidden lg:flex items-center gap-2 mt-2 rounded-xl px-4 py-2 text-xs text-text-3 hover:text-text-2 transition-colors"
              style={{ border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <RefreshCw size={12} /> Reset game
            </button>
          </div>

          {/* Game area */}
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{
              background: "rgba(12,13,24,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
              minHeight: 480,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`${active}-${keys[active]}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {active === "sql" && <SqlBugHunt />}
                {active === "data" && <DataDetective />}
                {active === "mrr" && <MRRClassifier />}
              </motion.div>
            </AnimatePresence>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
