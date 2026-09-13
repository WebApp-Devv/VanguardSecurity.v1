import { useLang, copy } from "@/i18n";

export default function Footer() {
  const { lang } = useLang();
  const c = copy[lang];

  return (
    <footer className="border-t border-white/10 py-12" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-gold" />
            <span className="font-display font-semibold tracking-tight text-lg">VANGUARD</span>
          </div>
          <p className="mt-3 text-sm text-neutral-500 max-w-xs">{c.footer.tagline}</p>
        </div>
        <div className="text-sm text-neutral-500 md:text-right">
          <p>{c.footer.location}</p>
          <p className="mt-2 text-neutral-600">{c.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
