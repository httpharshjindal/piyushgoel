export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 px-[18px] py-3">
      <a href="/" className="leading-none no-underline">
        <strong className="block font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-oxblood leading-tight">
          Piyush Goel
        </strong>
        <span className="text-[10px] sm:text-xs font-semibold uppercase text-muted">
          Voice Artist / Content Host
        </span>
      </a>

      <nav className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-muted">
        <a href="#about" className="hover:text-oxblood">About</a>
        <a href="#work" className="hover:text-oxblood">Work</a>
        <a href="#reels" className="hover:text-oxblood">Reels</a>
        <a href="#contact" className="hover:text-oxblood">Contact</a>
      </nav>
    </header>
  );
}
