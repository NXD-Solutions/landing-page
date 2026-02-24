export function Hero() {
  return (
    <section className="pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl">
          <span className="inline-block bg-primary-light text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
            Early access
          </span>
          <h1 className="text-5xl font-bold text-ink leading-tight mb-6">
            Empower your managers.<br />
            <span className="text-primary">Elevate your teams.</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-10 max-w-xl">
            Manager Hub gives frontline managers the AI tools they need to lead
            with clarity, confidence, and care — without adding to their workload.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="#early-access"
              className="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Request early access
            </a>
            <a
              href="#how-it-works"
              className="bg-surface text-ink font-medium px-6 py-3 rounded-lg border border-border hover:border-primary/50 transition-colors"
            >
              See how it works
            </a>
          </div>
        </div>

        {/* Dashboard preview placeholder */}
        <div className="mt-16 bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="bg-primary-light/50 border-b border-border px-4 py-3 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-border" />
            <div className="w-3 h-3 rounded-full bg-border" />
            <div className="w-3 h-3 rounded-full bg-border" />
          </div>
          <div className="p-6 grid grid-cols-3 gap-4">
            {/* Mock stat cards */}
            {[
              { label: 'Team health score', value: '87%', delta: '+4pts' },
              { label: 'Open action items', value: '3', delta: '2 due today' },
              { label: 'Next 1:1', value: 'Tuesday', delta: 'Sara Jensen' },
            ].map((card) => (
              <div key={card.label} className="bg-canvas rounded-xl p-4 border border-border">
                <p className="text-xs text-muted mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-ink">{card.value}</p>
                <p className="text-xs text-primary mt-1">{card.delta}</p>
              </div>
            ))}
          </div>
          <div className="px-6 pb-6 grid grid-cols-2 gap-4">
            {/* Mock insight cards */}
            <div className="bg-accent-light rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-accent mb-2">AI Insight</p>
              <p className="text-sm text-ink">Marcus has flagged workload concerns twice this week. Consider a check-in before Thursday's sprint review.</p>
            </div>
            <div className="bg-primary-light rounded-xl p-4 border border-border">
              <p className="text-xs font-semibold text-primary mb-2">Coaching tip</p>
              <p className="text-sm text-ink">Your team's energy tends to dip mid-week. Short async recognition on Wednesdays has helped similar teams.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
