import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShieldCheck } from "lucide-react";
import { useLang, copy } from "@/i18n";

export default function Header({ onOpenQuiz, onNavigate }) {
  const { lang, setLang } = useLang();
  const c = copy[lang].nav;
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "services", label: c.services, hash: "#services", testid: "nav-services-link" },
    { id: "about", label: c.about, hash: "#about", testid: "nav-about-link" },
    { id: "contact", label: c.contact, hash: "#contact", testid: "nav-contact-link" },
  ];

  const go = (hash) => {
    setMenuOpen(false);
    onNavigate(hash);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-4 md:px-8 pt-4" data-testid="site-header">
      <div className="glass-strong rounded-full max-w-7xl mx-auto flex items-center justify-between pl-6 pr-3 py-3">
        <button
          data-testid="header-logo"
          onClick={() => window.__lenis?.scrollTo(0, { duration: 1.4 })}
          className="flex items-center gap-2.5 group"
        >
          <span className="w-2.5 h-2.5 rotate-45 bg-gold group-hover:bg-gold-bright transition-colors duration-300" />
          <span className="font-display font-semibold tracking-tight text-lg text-white">
            VANGUARD
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-8" data-testid="main-nav">
          {links.map((l) => (
            <button
              key={l.id}
              data-testid={l.testid}
              onClick={() => go(l.hash)}
              className="text-sm text-neutral-400 hover:text-gold transition-colors duration-300 tracking-wide"
            >
              {l.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="glass rounded-full flex p-1" data-testid="lang-toggle">
            {["sq", "en"].map((l) => (
              <button
                key={l}
                data-testid={`lang-toggle-${l}`}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                  lang === l ? "bg-gold text-ink" : "text-neutral-400 hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            data-testid="header-choose-vanguard-btn"
            onClick={onOpenQuiz}
            className="hidden sm:flex items-center gap-2 bg-gold hover:bg-gold-bright text-ink text-sm font-bold rounded-full px-5 py-2.5 transition-[transform,background-color] duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            <ShieldCheck size={16} strokeWidth={2.5} />
            {c.cta}
          </button>

          <button
            data-testid="mobile-menu-btn"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden glass rounded-full p-2.5 text-white"
            aria-label="Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="md:hidden glass-strong rounded-3xl mt-3 max-w-7xl mx-auto p-4 flex flex-col gap-1"
            data-testid="mobile-menu"
          >
            {links.map((l) => (
              <button
                key={l.id}
                data-testid={`mobile-nav-${l.id}-link`}
                onClick={() => go(l.hash)}
                className="text-left text-neutral-300 hover:text-gold transition-colors duration-300 py-3 px-4 rounded-2xl hover:bg-white/5"
              >
                {l.label}
              </button>
            ))}
            <button
              data-testid="mobile-choose-vanguard-btn"
              onClick={() => {
                setMenuOpen(false);
                onOpenQuiz();
              }}
              className="mt-2 bg-gold text-ink font-bold rounded-full px-5 py-3 text-sm"
            >
              {c.cta}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
