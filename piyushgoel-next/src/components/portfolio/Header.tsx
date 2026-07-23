export function Header({ adminMode }: { adminMode?: boolean }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-[18px] py-3">
      <a href="/" className="leading-none no-underline">
        <strong className="block font-serif text-5xl font-bold text-oxblood">
          Piyush Goel
        </strong>
        <span className="text-xs font-semibold uppercase text-muted">
          Voice Artist / Content Host
        </span>
      </a>

      <nav className="flex flex-wrap items-center gap-5 text-sm text-muted">
        <a href="#about" className="hover:text-oxblood">About</a>
        <a href="#work" className="hover:text-oxblood">Previous Work</a>
        <a href="#career" className="hover:text-oxblood">Career</a>
        <a href="#contact" className="hover:text-oxblood">Contact</a>
        {adminMode ? (
          <a href="/" className="rounded-full border border-ink/10 px-4 py-2 text-ink">
            View Site
          </a>
        ) : (
          <a href="/admin" className="rounded-full border border-ink/10 px-4 py-2 text-ink">
            Admin
          </a>
        )}
      </nav>
    </header>
  );
}
