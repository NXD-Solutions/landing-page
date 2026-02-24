const steps = [
  {
    number: '01',
    title: 'Connect your team',
    description:
      'Integrate Manager Hub with your existing HR tools, calendar, and communication platforms in minutes. No lengthy setup — no IT ticket required.',
  },
  {
    number: '02',
    title: 'Get personalised insights',
    description:
      'AI surfaces what matters most for your specific team, based on patterns, signals, and context — not generic best practices.',
  },
  {
    number: '03',
    title: 'Act with confidence',
    description:
      'Follow structured playbooks, get coaching in the moment, or use AI-suggested actions. Track outcomes over time and keep improving.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-ink mb-4">How it works</h2>
          <p className="text-muted max-w-md mx-auto">
            From setup to first insight in under 15 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-1/2 w-full h-px bg-border" />
              )}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-primary-light border-2 border-primary text-primary font-bold text-sm flex items-center justify-center mb-5">
                  {step.number}
                </div>
                <h3 className="font-semibold text-ink mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
