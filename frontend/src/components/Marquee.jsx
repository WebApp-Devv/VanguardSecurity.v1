import { useLang, copy } from "@/i18n";

export default function Marquee() {
  const { lang } = useLang();
  const words = copy[lang].marquee;
  const row = [...words, ...words, ...words];

  return (
    <div className="relative border-y border-white/10 py-7 overflow-hidden bg-ink" data-testid="editorial-marquee">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center">
            {row.map((w, i) => (
              <span key={`${half}-${i}`} className="flex items-center">
                <span className="font-display font-medium text-2xl md:text-4xl tracking-[0.22em] text-white/15 whitespace-nowrap px-6">
                  {w}
                </span>
                <span className="w-2 h-2 rotate-45 bg-gold/40 shrink-0" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
