export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted">
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary">NXD</span>
          <span className="text-border">·</span>
          <span>Manager Hub</span>
        </div>

        <div className="flex items-center gap-6">
          <a href="#features" className="hover:text-ink transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-ink transition-colors">How it works</a>
          <a href="#about" className="hover:text-ink transition-colors">About</a>
          <a href="#early-access" className="hover:text-ink transition-colors">Early access</a>
        </div>

        <p className="text-xs">
          &copy; {new Date().getFullYear()} NXD Solutions. EU data residency. Built with care.
        </p>
      </div>
    </footer>
  )
}
