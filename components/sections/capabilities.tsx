import { FadeIn, StaggerContainer, StaggerItem } from "@/components/ui/motion-wrapper";

const capabilities = [
  {
    area: "Revenue & Retention Analytics",
    icon: "↗",
    color: "#3D7BFD",
    outcomes: [
      "MRR waterfall covering New, Expansion, Contraction, and Churn with data quality validation built in",
      "Customer health scoring models that give CS a single actionable number",
      "Cohort retention analysis identifying where and when the business loses customers",
      "NRR and GRR calculation with the subscription state issues most pipelines miss",
    ],
    tools: ["PostgreSQL", "Python", "Excel"],
  },
  {
    area: "Operations & Logistics Analytics",
    icon: "⬡",
    color: "#0DB8A2",
    outcomes: [
      "Delivery performance analysis by region, carrier, or time period",
      "Delay-to-satisfaction correlation that quantifies where SLA investment has the highest ROI",
      "RFM customer segmentation using SQL window functions, not a third-party platform",
      "Freight cost analysis surfacing regional inefficiencies and carrier performance gaps",
    ],
    tools: ["PostgreSQL", "Tableau", "Excel"],
  },
  {
    area: "Healthcare & Revenue Cycle Analytics",
    icon: "◈",
    color: "#8B5CF6",
    outcomes: [
      "AR aging reports bucketed 0-30 / 31-60 / 61-90 / 90+ days with payer-level breakdown",
      "Net collection rate per department, identifying where billing recovery is leaving money on the table",
      "No-show prediction analysis from scheduling lead time and patient demographic data",
      "Executive KPI workbooks designed per audience: CMO view differs from CFO view differs from ops",
    ],
    tools: ["PostgreSQL", "Excel", "Tableau"],
  },
  {
    area: "BI Delivery & Stakeholder Reporting",
    icon: "▦",
    color: "#F59E0B",
    outcomes: [
      "Tableau dashboards built for a named audience and a specific decision, not a generic overview",
      "Excel workbooks generated programmatically: conditional formatting, documented formulas, no manual editing",
      "Python ETL pipelines from raw CSV to presentation-ready output without manual steps",
      "SQL-to-deliverable workflows that are fully reproducible and version-controlled",
    ],
    tools: ["Tableau", "Power BI", "openpyxl", "Python"],
  },
];

const alsoKnow = [
  "NTILE window functions", "CTEs", "Cohort analysis", "AR aging",
  "RFM segmentation", "MRR waterfall", "Net Revenue Retention",
  "Customer health scoring", "Disengagement alerting", "Data quality auditing",
  "scikit-learn", "Next.js", "TypeScript", "Git", "Claude API",
  "Prompt engineering", "LLM agent design",
];

export function Capabilities() {
  return (
    <section id="capabilities" className="py-28 bg-surface-1">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <FadeIn className="mb-16">
          <span className="font-mono text-label text-text-3 tracking-widest uppercase">
            Capabilities
          </span>
          <div className="mt-3 flex flex-wrap items-end gap-6 justify-between">
            <h2 className="text-display-sm font-bold text-text-1">
              Skills mapped to outcomes
            </h2>
            <p className="max-w-sm text-sm text-text-2 leading-relaxed">
              Each capability maps to the business problem it solves.
            </p>
          </div>
        </FadeIn>

        <StaggerContainer className="grid gap-5 md:grid-cols-2">
          {capabilities.map((cap) => (
            <StaggerItem key={cap.area}>
              <div
                className="group flex h-full flex-col gap-5 rounded-2xl p-7 transition-all"
                style={{
                  borderTop: `2px solid ${cap.color}`,
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderTopWidth: 2,
                  borderTopStyle: "solid",
                  borderTopColor: cap.color,
                  background: "rgba(12,13,24,0.55)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex-shrink-0 text-lg leading-none"
                    style={{ color: cap.color }}
                  >
                    {cap.icon}
                  </span>
                  <h3 className="text-base font-semibold text-text-1 leading-snug">
                    {cap.area}
                  </h3>
                </div>
                <ul className="flex flex-col gap-3 flex-1">
                  {cap.outcomes.map((o) => (
                    <li
                      key={o}
                      className="flex items-start gap-3 text-sm text-text-2 leading-relaxed"
                    >
                      <span
                        className="mt-2 h-1 w-1 flex-shrink-0 rounded-full"
                        style={{ background: cap.color }}
                      />
                      {o}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border-base">
                  {cap.tools.map((t) => (
                    <span
                      key={t}
                      className="rounded-md px-2.5 py-1 font-mono text-xs text-text-3"
                      style={{ background: "#12131F" }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.2} className="mt-8 rounded-2xl p-7" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(12,13,24,0.55)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
          <p className="mb-4 text-xs font-medium text-text-3 uppercase tracking-widest">
            Also in the toolkit
          </p>
          <div className="flex flex-wrap gap-2">
            {alsoKnow.map((t) => (
              <span
                key={t}
                className="rounded-md border border-border-base px-2.5 py-1 font-mono text-xs text-text-3 hover:text-text-2 hover:border-border-accent transition-colors cursor-default"
              >
                {t}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
