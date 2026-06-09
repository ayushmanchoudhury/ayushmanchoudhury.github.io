"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, ArrowUpRight, Hash, ExternalLink, Terminal, User, Zap } from "lucide-react";

type Command = {
  id: string;
  label: string;
  description?: string;
  category: string;
  icon: React.ReactNode;
  keywords: string[];
  action: () => void;
};

function scrollTo(id: string) {
  document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
}

export function CommandBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: "work",
      label: "View Case Studies",
      description: "SaaS, logistics, healthcare analytics projects",
      category: "Navigate",
      icon: <Hash size={14} />,
      keywords: ["work", "projects", "case", "studies", "sql", "analytics"],
      action: () => { scrollTo("#work"); setOpen(false); },
    },
    {
      id: "capabilities",
      label: "See Capabilities",
      description: "Revenue, operations, healthcare, BI",
      category: "Navigate",
      icon: <Hash size={14} />,
      keywords: ["capabilities", "skills", "stack", "tools"],
      action: () => { scrollTo("#capabilities"); setOpen(false); },
    },
    {
      id: "ai",
      label: "AI Creative Systems",
      description: "Multi-agent Claude API workflow",
      category: "Navigate",
      icon: <Zap size={14} />,
      keywords: ["ai", "creative", "claude", "llm", "agent"],
      action: () => { scrollTo("#creative"); setOpen(false); },
    },
    {
      id: "about",
      label: "About Ayush",
      description: "Background, approach, methodology",
      category: "Navigate",
      icon: <User size={14} />,
      keywords: ["about", "who", "background", "bio"],
      action: () => { scrollTo("#about"); setOpen(false); },
    },
    {
      id: "contact",
      label: "Get In Touch",
      description: "Open to full-time analyst roles",
      category: "Navigate",
      icon: <Hash size={14} />,
      keywords: ["contact", "hire", "email", "reach", "job"],
      action: () => { scrollTo("#contact"); setOpen(false); },
    },
    {
      id: "games",
      label: "Play Data Games",
      description: "SQL Bug Hunt, Data Detective, MRR Waterfall",
      category: "Navigate",
      icon: <Terminal size={14} />,
      keywords: ["game", "games", "play", "sql", "fun", "interactive"],
      action: () => { scrollTo("#games"); setOpen(false); },
    },
    {
      id: "hire",
      label: "Why Hire Ayush?",
      description: "Business-first analyst with validated SQL and delivery",
      category: "Explore",
      icon: <Zap size={14} />,
      keywords: ["hire", "why", "best", "reason", "value"],
      action: () => { scrollTo("#about"); setOpen(false); },
    },
    {
      id: "sql",
      label: "Show SQL Skills",
      description: "MRR waterfall, window functions, cohort analysis",
      category: "Explore",
      icon: <Terminal size={14} />,
      keywords: ["sql", "query", "database", "postgres", "window"],
      action: () => { scrollTo("#work"); setOpen(false); },
    },
    {
      id: "resume",
      label: "Download Resume",
      description: "Open PDF in new tab",
      category: "Open",
      icon: <ExternalLink size={14} />,
      keywords: ["resume", "cv", "download", "pdf"],
      action: () => { window.open("/resume.pdf", "_blank"); setOpen(false); },
    },
    {
      id: "github",
      label: "GitHub Profile",
      description: "github.com/ayushmanchoudhury",
      category: "Open",
      icon: <ExternalLink size={14} />,
      keywords: ["github", "code", "repo", "git"],
      action: () => { window.open("https://github.com/ayushmanchoudhury", "_blank"); setOpen(false); },
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      description: "linkedin.com/in/ayushmanchoudhury",
      category: "Open",
      icon: <ExternalLink size={14} />,
      keywords: ["linkedin", "profile", "connect"],
      action: () => { window.open("https://www.linkedin.com/in/ayushmanchoudhury/", "_blank"); setOpen(false); },
    },
    {
      id: "best-project",
      label: "Best Project",
      description: "RavenStack: SaaS churn that found $161K at-risk MRR",
      category: "Explore",
      icon: <Zap size={14} />,
      keywords: ["best", "featured", "top", "project", "ravenstack"],
      action: () => { scrollTo("#work"); setOpen(false); },
    },
  ];

  const filtered = query.trim()
    ? commands.filter((c) => {
        const q = query.toLowerCase();
        return (
          c.label.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.keywords.some((k) => k.includes(q))
        );
      })
    : commands;

  const grouped = filtered.reduce<Record<string, Command[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const flat = filtered;

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setSelected(0);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      const isInput = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable;

      if (!open && e.key === "/" && !isInput) {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (!open && (e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
        return;
      }
      if (open) {
        if (e.key === "Escape") { close(); return; }
        if (e.key === "ArrowDown") { e.preventDefault(); setSelected((s) => Math.min(s + 1, flat.length - 1)); }
        if (e.key === "ArrowUp") { e.preventDefault(); setSelected((s) => Math.max(s - 1, 0)); }
        if (e.key === "Enter") {
          e.preventDefault();
          flat[selected]?.action();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, flat, selected, close]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    }
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  let globalIdx = 0;

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
              onClick={close}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-1/2 top-[15%] z-[101] w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl shadow-2xl"
              style={{
                background: "rgba(12,13,24,0.92)",
                border: "1px solid rgba(255,255,255,0.1)",
                backdropFilter: "blur(24px)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(61,123,253,0.15), inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-4 py-4"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
              >
                <Search size={16} className="text-text-3 flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Type a command or search..."
                  className="flex-1 bg-transparent text-sm text-text-1 placeholder:text-text-3 outline-none"
                />
                <kbd
                  className="hidden sm:block rounded px-1.5 py-0.5 font-mono text-[10px] text-text-3"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  ESC
                </kbd>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(grouped).map(([category, cmds]) => (
                  <div key={category} className="mb-1">
                    <div className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-text-3">
                      {category}
                    </div>
                    {cmds.map((cmd) => {
                      const idx = globalIdx++;
                      const isSelected = idx === selected;
                      return (
                        <button
                          key={cmd.id}
                          onMouseEnter={() => setSelected(idx)}
                          onClick={cmd.action}
                          className="w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
                          style={{
                            background: isSelected ? "rgba(61,123,253,0.12)" : "transparent",
                            border: isSelected ? "1px solid rgba(61,123,253,0.2)" : "1px solid transparent",
                          }}
                        >
                          <span
                            className="flex-shrink-0"
                            style={{ color: isSelected ? "#3D7BFD" : "rgba(255,255,255,0.3)" }}
                          >
                            {cmd.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-text-1 truncate">{cmd.label}</div>
                            {cmd.description && (
                              <div className="text-xs text-text-3 truncate mt-0.5">{cmd.description}</div>
                            )}
                          </div>
                          {isSelected && (
                            <kbd
                              className="flex-shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] text-text-3"
                              style={{ background: "rgba(255,255,255,0.06)" }}
                            >
                              ↵
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
                {flat.length === 0 && (
                  <div className="py-8 text-center text-sm text-text-3">No commands found</div>
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center gap-4 px-4 py-2.5"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <span className="font-mono text-[10px] text-text-3">↑↓ navigate</span>
                <span className="font-mono text-[10px] text-text-3">↵ select</span>
                <span className="font-mono text-[10px] text-text-3">esc close</span>
                <span className="ml-auto font-mono text-[10px] text-text-3">⌘K or /</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
