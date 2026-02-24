export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-primary tracking-tight">NXD</span>
          <span className="text-border text-lg select-none">·</span>
          <span className="text-ink font-medium text-sm">Manager Hub</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-ink transition-colors">How it works</a>
          <a href="#about" className="hover:text-ink transition-colors">About</a>
        </div>

        <a
          href="#early-access"
          className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Get early access
        </a>
      </div>
    </nav>
  )
}
