import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ShieldCheck } from "lucide-react";
import { useLang, copy } from "@/i18n";

const HERO_IMG =
  "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&q=75&w=1600";

const lineReveal = {
  hidden: { y: "115%" },
  show: (i) => ({
    y: "0%",
    transition: { delay: 0.35 + i * 0.14, duration: 1.05, ease: [0.76, 0, 0.24, 1] },
  }),
};

export default function Hero({ onOpenQuiz, onNavigate }) {
  const { lang } = useLang();
  const c = copy[lang].hero;
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.22]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden" data-testid="hero-section">
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-0">
        <img src={HERO_IMG} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(5,5,5,0.92),rgba(5,5,5,0.55)_55%,rgba(5,5,5,0.35))]" />
      </motion.div>
      <div className="absolute inset-0 gold-radial" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-[linear-gradient(to_top,#050505,transparent)]" />

      <motion.div style={{ opacity: fade }} className="relative z-10 flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full px-6 md:px-12 pt-36 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8 }}
          className="glass rounded-full inline-flex items-center gap-2.5 self-start px-5 py-2.5 mb-10"
          data-testid="hero-eyebrow"
        >
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full bg-gold animate-pulse-ring" />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-gold" />
          </span>
          <span className="text-xs md:text-sm tracking-[0.18em] uppercase text-neutral-300">{c.eyebrow}</span>
        </motion.div>

        <h1 className="font-display font-semibold tracking-tight text-[13.5vw] sm:text-7xl lg:text-8xl leading-[0.95]" data-testid="hero-headline">
          <span className="block overflow-hidden pb-1">
            <motion.span custom={0} variants={lineReveal} initial="hidden" animate="show" className="block">
              {c.line1}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span custom={1} variants={lineReveal} initial="hidden" animate="show" className="block text-gold italic font-medium">
              {c.line2}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9 }}
          className="mt-10 max-w-xl text-neutral-400 text-base md:text-lg leading-relaxed"
          data-testid="hero-subtext"
        >
          {c.sub}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.9 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <button
            data-testid="choose-vanguard-btn"
            onClick={onOpenQuiz}
            className="group flex items-center gap-3 bg-gold hover:bg-gold-bright text-ink font-bold rounded-full px-8 py-4 text-base transition-[transform,background-color] duration-300 hover:scale-[1.04] active:scale-[0.98] shadow-[0_0_50px_rgba(212,175,55,0.25)]"
          >
            <ShieldCheck size={20} strokeWidth={2.5} className="transition-transform duration-300 group-hover:rotate-6" />
            {c.ctaPrimary}
          </button>
          <button
            data-testid="hero-explore-services-btn"
            onClick={() => onNavigate("#services")}
            className="glass rounded-full px-8 py-4 text-base font-semibold text-white border-white/15 hover:border-gold/60 hover:text-gold transition-[color,border-color] duration-300"
          >
            {c.ctaSecondary}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 1 }}
          className="mt-16 grid grid-cols-3 max-w-lg gap-6"
          data-testid="hero-stats"
        >
          {c.stats.map((s, i) => (
            <div key={i} className="border-l border-gold/40 pl-4">
              <div className="font-display text-2xl md:text-3xl font-semibold text-gold">{s.value}</div>
              <div className="text-xs text-neutral-500 mt-1 leading-snug">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      <motion.button
        data-testid="hero-scroll-indicator"
        onClick={() => onNavigate("#services")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.7 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-neutral-500 hover:text-gold transition-colors duration-300"
        aria-label="Scroll down"
      >
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }} className="block">
          <ArrowDown size={22} />
        </motion.span>
      </motion.button>
    </section>
  );
}
