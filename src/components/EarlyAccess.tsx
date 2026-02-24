import { useState } from 'react'

export function EarlyAccess() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
    }
  }

  return (
    <section id="early-access" className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-block bg-accent-light text-accent text-xs font-semibold px-3 py-1 rounded-full mb-6 tracking-wide uppercase">
          Limited spots available
        </span>
        <h2 className="text-3xl font-bold text-ink mb-4">
          Be the first to lead differently.
        </h2>
        <p className="text-muted mb-10">
          Join the early access list and be part of the group that shapes Manager Hub.
          We're onboarding a small cohort of managers who want to lead with better tools.
        </p>

        {submitted ? (
          <div className="bg-primary-light border border-primary/30 rounded-2xl px-8 py-10">
            <p className="text-2xl mb-2">You're on the list.</p>
            <p className="text-muted text-sm">
              We'll be in touch with next steps. In the meantime, keep doing great work.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@company.com"
              className="flex-1 bg-surface border border-border rounded-lg px-4 py-3 text-sm text-ink placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
            />
            <button
              type="submit"
              className="bg-primary text-white font-medium px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap"
            >
              Request access
            </button>
          </form>
        )}

        <p className="text-xs text-muted mt-4">No spam. No obligation. Unsubscribe anytime.</p>
      </div>
    </section>
  )
}
