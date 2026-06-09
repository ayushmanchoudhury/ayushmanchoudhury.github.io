"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Eye, Code2, Database } from "lucide-react";
import { useAnimationFrame, AnimatePresence, motion } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FadeIn, HoverCard, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";
import { projects } from "@/lib/projects";

// Animated gradient border wrapper for the hero card
function AnimatedGradientBorder({ children }: { children: React.ReactNode }) {
  const [angle, setAngle] = useState(0);
  const prevTimeRef = useRef<number | null>(null);

  useAnimationFrame((time) => {
    if (prevTimeRef.current === null) prevTimeRef.current = time;
    const delta = time - prevTimeRef.current;
    setAngle((prev) => (prev + (delta / 4000) * 360) % 360);
    prevTimeRef.current = time;
  });

  return (
    <div className="relative rounded-2xl p-[1px]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl"
        style={{
          background: `conic-gradient(from ${angle}deg at 50% 50%, #3D7BFD 0deg, #0DB8A2 90deg, transparent 160deg, transparent 200deg, #0DB8A2 270deg, #3D7BFD 360deg)`,
          opacity: 0.55,
        }}
      />
      <div className="relative rounded-2xl overflow-hidden" style={{ background: "#0C0D18" }}>
        {children}
      </div>
    </div>
  );
}

// Case study loading overlay
function CaseStudyLoader({ label, onDone }: { label: string; onDone: () => void }) {
  const [stage, setStage] = useState(0);
  const stages = ["Loading dataset...", "Running SQL...", "Building insights..."];
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 450);
    const t2 = setTimeout(() => setStage(2), 950);
    const t3 = setTimeout(() => onDoneRef.current(), 1550);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[90] flex items-center justify-center"
      style={{ background: "rgba(6,7,15,0.92)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(61,123,253,0.12)", border: "1px solid rgba(61,123,253,0.3)" }}
          >
            <Database size={24} className="text-blue-primary" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1, repeat: Infinity }}
            style={{ border: "1px solid #3D7BFD", boxShadow: "0 0 20px rgba(61,123,253,0.4)" }}
          />
        </div>
        <div className="text-center">
          <div className="font-mono text-xs text-text-3 uppercase tracking-widest mb-3">
            Opening case study
          </div>
          <div className="font-mono text-sm text-text-1 mb-1">{label}</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={stage}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="font-mono text-xs"
              style={{ color: "#3D7BFD" }}
            >
              {stages[stage]}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex gap-1.5">
          {stages.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 rounded-full"
              animate={{ width: i <= stage ? 24 : 8, background: i <= stage ? "#3D7BFD" : "rgba(255,255,255,0.12)" }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Behind the Scenes SQL view
function BehindTheScenesView({ project }: { project: typeof projects[0] }) {
  return (
    <div className="flex flex-col h-full p-6 md:p-8 gap-5">
      <div className="flex items-center gap-2 mb-1">
        <Code2 size={14} style={{ color: project.color }} />
        <span className="font-mono text-xs uppercase tracking-widest" style={{ color: project.color }}>
          Behind the scenes
        </span>
      </div>

      {/* Data model decisions */}
      <div>
        <div className="font-mono text-[10px] uppercase tracking-wider text-text-3 mb-2">Data decisions</div>
        <div className="space-y-2">
          {project.process.slice(0, 2).map((p) => (
            <div
              key={p.step}
              className="rounded-lg p-3"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="text-xs font-semibold text-text-2 mb-1">{p.step}</div>
              <div className="text-xs text-text-3 leading-relaxed line-clamp-2">{p.detail}</div>
            </div>
          ))}
        </div>
      </div>

      {/* SQL snippet */}
      {project.sql && (
        <div className="flex-1 min-h-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-text-3 mb-2">Core SQL</div>
          <div
            className="rounded-lg p-4 overflow-auto"
            style={{ background: "#06070F", border: "1px solid rgba(255,255,255,0.06)", maxHeight: 200 }}
          >
            <pre className="font-mono text-[11px] leading-relaxed text-text-2 whitespace-pre-wrap">
              {project.sql.split("\n").map((line, i) => {
                const kw = /^(SELECT|FROM|WHERE|WITH|GROUP|ORDER|AS|ON|JOIN|LEFT|INNER|HAVING|UNION|INSERT|UPDATE|DELETE|PARTITION|OVER|LAG|SUM|COUNT|AVG|CASE|WHEN|THEN|ELSE|END|AND|OR|NOT|NULL|TRUE|FALSE|BY|INTO|SET)\b/i;
                const colored = line.replace(kw, (m) => `<span class="token-kw">${m}</span>`);
                return (
                  <div
                    key={i}
                    dangerouslySetInnerHTML={{ __html: colored.replace(/--.*$/, (m) => `<span class="token-cm">${m}</span>`) }}
                  />
                );
              })}
            </pre>
          </div>
        </div>
      )}

      {/* What broke first */}
      <div
        className="rounded-lg px-4 py-3"
        style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)" }}
      >
        <div className="font-mono text-[10px] uppercase tracking-wider mb-1" style={{ color: "#F59E0B" }}>
          What broke first
        </div>
        <div className="text-xs text-text-3 leading-relaxed">
          {project.process[1]?.detail?.slice(0, 140) ?? project.context.slice(0, 140)}...
        </div>
      </div>
    </div>
  );
}

export function FeaturedWork() {
  const [hero, ...rest] = projects;
  const [heroFlipped, setHeroFlipped] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<{ slug: string; title: string } | null>(null);
  const router = useRouter();

  const handleProjectClick = useCallback(
    (e: React.MouseEvent, slug: string, title: string) => {
      e.preventDefault();
      setLoading({ slug, title });
    },
    []
  );

  const handleLoadDone = useCallback(() => {
    if (!loading) return;
    router.push(`/work/${loading.slug}`);
    setLoading(null);
  }, [loading, router]);

  return (
    <section id="work" className="py-28 bg-bg">
      <AnimatePresence>
        {loading && (
          <CaseStudyLoader label={loading.title} onDone={handleLoadDone} />
        )}
      </AnimatePresence>

      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <FadeIn className="mb-16">
          <span className="font-mono text-label text-text-3 tracking-widest uppercase">
            Selected Work
          </span>
          <div className="mt-3 flex flex-wrap items-end gap-6 justify-between">
            <h2 className="text-display-sm font-bold text-text-1">
              Case studies
            </h2>
            <p className="max-w-md text-base text-text-2 leading-relaxed">
              Three end-to-end analytics projects. Each starts from a business
              question, not a dataset. Each ends with a recommendation someone
              can act on.
            </p>
          </div>
        </FadeIn>

        {/* Hero project — full width with animated gradient border */}
        <FadeIn className="mb-6">
          <HoverCard>
            <AnimatedGradientBorder>
              <div className="shadow-card hover:shadow-card-hover transition-all" style={{ borderTop: `2px solid ${hero.color}` }}>
                <div className="grid gap-0 md:grid-cols-[1fr_420px]">
                  {/* Left: content */}
                  <div className="flex flex-col gap-6 p-8 md:p-10">
                    <div className="flex items-center gap-3">
                      <span
                        className="rounded-full px-3 py-1 font-mono text-xs font-semibold uppercase tracking-widest"
                        style={{ color: hero.color, background: hero.colorMuted }}
                      >
                        {hero.industry}
                      </span>
                      <span className="rounded-md border border-border-accent px-2 py-0.5 font-mono text-[10px] text-text-3">
                        Featured
                      </span>
                      {/* Behind the scenes toggle */}
                      <button
                        onClick={() => setHeroFlipped((v) => !v)}
                        className="ml-auto flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs transition-all"
                        style={{
                          background: heroFlipped ? "rgba(61,123,253,0.15)" : "rgba(255,255,255,0.04)",
                          border: heroFlipped ? "1px solid rgba(61,123,253,0.3)" : "1px solid rgba(255,255,255,0.08)",
                          color: heroFlipped ? "#3D7BFD" : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {heroFlipped ? <Eye size={12} /> : <Code2 size={12} />}
                        {heroFlipped ? "Polished view" : "Behind the scenes"}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {heroFlipped ? (
                        <motion.div
                          key="behind"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="-mx-2"
                        >
                          <BehindTheScenesView project={hero} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="polished"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.25 }}
                          className="flex flex-col gap-6"
                        >
                          <div>
                            <h3
                              className="font-bold text-text-1 leading-tight"
                              style={{ fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)", letterSpacing: "-0.025em" }}
                            >
                              {hero.title}
                            </h3>
                            <p className="mt-2 text-base text-text-2 leading-relaxed max-w-lg">
                              {hero.subtitle}
                            </p>
                          </div>

                          <blockquote
                            className="rounded-xl px-5 py-4 text-sm italic text-text-2 leading-relaxed border-l-2 max-w-lg"
                            style={{ borderColor: hero.color, background: hero.colorMuted }}
                          >
                            &ldquo;{hero.hook}&rdquo;
                          </blockquote>

                          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-lg">
                            {hero.stats.map((s) => (
                              <div key={s.label} className="rounded-lg bg-surface-2 px-3 py-3">
                                <div className="text-sm font-bold text-text-1">{s.value}</div>
                                <div className="text-xs text-text-3 mt-0.5 leading-snug">{s.label}</div>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {hero.stack.map((t) => (
                              <span
                                key={t}
                                className="rounded-md border border-border-base px-2.5 py-1 font-mono text-xs text-text-3"
                              >
                                {t}
                              </span>
                            ))}
                          </div>

                          <a
                            href={`/work/${hero.slug}`}
                            onClick={(e) => handleProjectClick(e, hero.slug, hero.title)}
                            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-text-2 hover:text-text-1 transition-colors mt-auto cursor-pointer"
                          >
                            View full case study
                            <ArrowUpRight
                              size={14}
                              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                            />
                          </a>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Right: screenshot or code preview */}
                  <div className="hidden md:flex border-l border-border-base bg-surface-2 flex-col overflow-hidden">
                    {hero.screenshotUrl ? (
                      <div className="relative flex-1 overflow-hidden">
                        <Image
                          src={hero.screenshotUrl}
                          alt={hero.screenshotAlt ?? hero.title}
                          fill
                          className="object-cover object-top opacity-60 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-surface-2/80 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="flex-1 p-6 font-mono text-xs leading-relaxed text-text-3 overflow-hidden">
                        <div className="mb-3 font-mono text-[10px] text-text-3 uppercase tracking-widest">
                          From the analysis
                        </div>
                        <div className="space-y-1.5">
                          <div className="text-text-3/60">-- Bug discovered in validation pipeline</div>
                          <div className="text-text-3/60">-- Reported MRR: $10.2M → Actual: $1.1M</div>
                          <div className="h-2" />
                          <div><span className="text-[#79C0FF]">SELECT</span> <span className="text-text-2">account_id, mrr_amount,</span></div>
                          <div className="pl-4"><span className="text-[#D2A8FF]">LAG</span><span className="text-text-2">(mrr_amount)</span></div>
                          <div className="pl-6"><span className="text-[#79C0FF]">OVER</span> <span className="text-text-2">(PARTITION BY account_id)</span></div>
                          <div className="pl-4"><span className="text-[#79C0FF]">AS</span> <span className="text-text-2">prev_mrr</span></div>
                          <div><span className="text-[#79C0FF]">FROM</span> <span className="text-text-2">subscriptions</span></div>
                          <div><span className="text-[#79C0FF]">WHERE</span> <span className="text-text-2">is_active = TRUE</span></div>
                          <div className="h-3 border-t border-white/5 mt-2 pt-2" />
                          <div className="text-teal-primary font-medium">→ 53 at-risk accounts · $161K MRR</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AnimatedGradientBorder>
          </HoverCard>
        </FadeIn>

        {/* Remaining projects — smaller cards */}
        <StaggerContainer className="grid gap-5 md:grid-cols-2">
          {rest.map((project) => {
            const flipped = flippedCards[project.slug] ?? false;
            return (
              <StaggerItem key={project.slug}>
                <HoverCard className="h-full">
                  <div
                    className="group flex h-full flex-col rounded-2xl border border-border-base bg-surface-1 overflow-hidden shadow-card hover:shadow-card-hover hover:border-border-accent transition-all"
                    style={{ borderTop: `2px solid ${project.color}` }}
                  >
                    <div className="flex flex-col gap-5 p-7 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className="font-mono text-label tracking-widest uppercase"
                          style={{ color: project.color }}
                        >
                          {project.industry}
                        </span>
                        <div className="flex items-center gap-2">
                          {project.featured && (
                            <span className="rounded-md border px-2 py-0.5 font-mono text-[10px] text-text-3 border-border-accent">
                              Featured
                            </span>
                          )}
                          <button
                            onClick={() =>
                              setFlippedCards((prev) => ({ ...prev, [project.slug]: !prev[project.slug] }))
                            }
                            className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-mono transition-all"
                            style={{
                              background: flipped ? "rgba(61,123,253,0.12)" : "rgba(255,255,255,0.04)",
                              border: flipped ? "1px solid rgba(61,123,253,0.25)" : "1px solid rgba(255,255,255,0.07)",
                              color: flipped ? "#3D7BFD" : "rgba(255,255,255,0.35)",
                            }}
                          >
                            {flipped ? <Eye size={10} /> : <Code2 size={10} />}
                            <span className="hidden sm:block">{flipped ? "polished" : "raw"}</span>
                          </button>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {flipped ? (
                          <motion.div
                            key="behind"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="-mx-2 flex-1"
                          >
                            <BehindTheScenesView project={project} />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="polished"
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col gap-5 flex-1"
                          >
                            <div>
                              <h3 className="text-base font-semibold text-text-1 leading-snug group-hover:text-white transition-colors">
                                {project.title}
                              </h3>
                              <p className="mt-1 text-sm text-text-3">{project.subtitle}</p>
                            </div>

                            <blockquote
                              className="rounded-xl px-4 py-3 text-sm italic text-text-2 leading-relaxed border-l-2"
                              style={{ borderColor: project.color, background: project.colorMuted }}
                            >
                              &ldquo;{project.hook}&rdquo;
                            </blockquote>

                            <div className="grid grid-cols-2 gap-2">
                              {project.stats.slice(0, 4).map((s) => (
                                <div key={s.label} className="rounded-lg bg-surface-2 px-3 py-2.5">
                                  <div className="text-sm font-semibold text-text-1">{s.value}</div>
                                  <div className="text-xs text-text-3 mt-0.5">{s.label}</div>
                                </div>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {project.stack.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-md border border-border-base px-2 py-0.5 font-mono text-xs text-text-3"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {!flipped && project.screenshotUrl && (
                      <div className="relative h-36 border-t border-border-base overflow-hidden">
                        <Image
                          src={project.screenshotUrl}
                          alt={project.screenshotAlt ?? project.title}
                          fill
                          className="object-cover object-top opacity-60 group-hover:opacity-80 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-1 via-surface-1/30" />
                      </div>
                    )}

                    <div className="border-t border-border-base px-7 py-4">
                      <a
                        href={`/work/${project.slug}`}
                        onClick={(e) => handleProjectClick(e, project.slug, project.title)}
                        className="group flex items-center gap-1.5 text-sm font-medium text-text-2 hover:text-text-1 transition-colors cursor-pointer"
                      >
                        View case study
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>
                </HoverCard>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
