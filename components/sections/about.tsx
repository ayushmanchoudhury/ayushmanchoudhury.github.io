import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const facts = [
  { label: "Status", value: "Open to full-time analyst roles" },
  { label: "Focus", value: "SaaS · E-commerce · Healthcare" },
  { label: "Core stack", value: "SQL, Python, Tableau, Excel" },
  { label: "Secondary", value: "AI automation via Claude API" },
  { label: "Location", value: "United States" },
];

const approach = [
  {
    num: "01",
    title: "Start with the business question",
    body: "Every analysis I build begins by asking what decision the output is supposed to inform. A dashboard nobody acts on is just a report.",
  },
  {
    num: "02",
    title: "Validate before you analyze",
    body: "Data quality bugs are silent. The RavenStack project surfaced a bug that made reported MRR look 9x larger than reality. I build validation pipelines before touching analysis.",
  },
  {
    num: "03",
    title: "Deliver for the audience, not the analyst",
    body: "A COO needs different output than a logistics director. I design deliverables for the person who has to act on the findings, not the person who ran the query.",
  },
];

export function About() {
  return (
    <section id="about" className="py-28 bg-surface-1">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        {/* Header */}
        <FadeIn className="mb-16">
          <span className="font-mono text-label text-text-3 tracking-widest uppercase">
            About
          </span>
          <h2 className="mt-3 text-display-sm font-bold text-text-1">
            How I actually work
          </h2>
        </FadeIn>

        <div className="grid gap-16 lg:grid-cols-[1fr_320px]">
          <div>
            {/* Approach cards */}
            <StaggerContainer className="space-y-4 mb-12">
              {approach.map((a) => (
                <StaggerItem key={a.num}>
                  <div className="flex gap-6 rounded-2xl p-6 transition-all" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(12,13,24,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
                    <span className="flex-shrink-0 font-mono text-xs text-text-3 mt-0.5">
                      {a.num}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-text-1 mb-2">{a.title}</h3>
                      <p className="text-sm text-text-2 leading-relaxed">{a.body}</p>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            {/* Bio */}
            <FadeIn delay={0.12} className="space-y-4 text-base text-text-2 leading-relaxed">
              <p>
                I build the analytics layer that tells leadership where the money is going
                and why it moved. The output is always designed for the specific person
                who has to act on the findings, not the analyst who ran the query.
              </p>
              <p>
                My portfolio covers SaaS revenue, e-commerce logistics, and healthcare revenue
                cycle. These are not easy domains with clean data. Each project runs the full
                pipeline from schema design through validated SQL to a Tableau dashboard built
                for a named audience.
              </p>
              <p>
                I also build AI automation systems. The creative engine I built uses a multi-agent
                Claude API workflow covering VOC research, brand strategy, creative production, and
                compliance review. That capability sits alongside the analytics work, not above it.
              </p>
            </FadeIn>

            <FadeIn delay={0.18} className="mt-8 flex flex-wrap gap-3">
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-primary/90 hover:-translate-y-0.5 transition-all"
              >
                Download Resume
              </a>
              <a
                href="https://www.linkedin.com/in/ayushmanchoudhury/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border-accent bg-surface-2 px-5 py-2.5 text-sm font-semibold text-text-1 hover:border-white/20 hover:-translate-y-0.5 transition-all"
              >
                LinkedIn ↗
              </a>
              <a
                href="https://github.com/ayushmanchoudhury"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-border-accent bg-surface-2 px-5 py-2.5 text-sm font-semibold text-text-1 hover:border-white/20 hover:-translate-y-0.5 transition-all"
              >
                GitHub ↗
              </a>
            </FadeIn>
          </div>

          {/* Fact card */}
          <FadeIn delay={0.12}>
            <div className="rounded-2xl p-7 sticky top-24" style={{ border: "1px solid rgba(255,255,255,0.09)", background: "rgba(12,13,24,0.6)", backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}>
              <p className="mb-5 font-mono text-xs text-text-3 uppercase tracking-widest">
                Quick facts
              </p>
              <StaggerContainer className="space-y-0">
                {facts.map((f, i) => (
                  <StaggerItem key={f.label}>
                    <div
                      className={`flex flex-col gap-1 py-4 ${
                        i < facts.length - 1 ? "border-b border-border-base" : ""
                      }`}
                    >
                      <span className="font-mono text-xs text-text-3 uppercase tracking-wider">
                        {f.label}
                      </span>
                      <span className="text-sm text-text-1">{f.value}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {/* Resume CTA inside card */}
              <div className="mt-6 pt-6 border-t border-border-base">
                <a
                  href="/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border-accent bg-surface-2 px-4 py-2.5 text-sm font-medium text-text-1 hover:border-white/20 transition-all"
                >
                  View Resume ↗
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
