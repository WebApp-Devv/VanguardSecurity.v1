import { motion } from "framer-motion";
import { useLang, copy } from "@/i18n";

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1784411641863-d163d776ed55?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAxODF8MHwxfHNlYXJjaHwyfHxtb2Rlcm4lMjBsdXh1cnklMjBidWlsZGluZyUyMG5pZ2h0fGVufDB8fHx8MTc4OTMwNjQzNnww&ixlib=rb-4.1.0&q=80&w=1200";

export default function About() {
  const { lang } = useLang();
  const c = copy[lang].about;

  return (
    <section id="about" className="relative py-16 md:py-24 bg-surface/40" data-testid="about-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
        <div className="lg:sticky lg:top-32 self-start">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-xs tracking-[0.3em] uppercase text-gold mb-4"
          >
            {c.eyebrow}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display font-semibold tracking-tight text-4xl md:text-5xl leading-[1.05]"
            data-testid="about-title"
          >
            {c.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-10 text-neutral-400 leading-relaxed text-sm md:text-base max-w-md"
          >
            {c.intro}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.25 }}
            className="mt-10 overflow-hidden rounded-[2rem] border border-white/10 h-56 md:h-72"
          >
            <img src={ABOUT_IMG} alt="Vanguard Security" loading="lazy" className="w-full h-full object-cover opacity-70" />
          </motion.div>
        </div>

        <div className="flex flex-col">
          {c.chapters.map((ch, i) => (
            <motion.div
              key={ch.n}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="border-t border-white/10 py-10 md:py-12 first:border-t-0 lg:first:border-t"
              data-testid={`about-chapter-${ch.n}`}
            >
              <span className="font-display text-gold/70 text-sm tracking-[0.35em]">{ch.n}</span>
              <h3 className="font-display font-semibold tracking-tight text-3xl md:text-4xl mt-3">{ch.title}</h3>
              <p className="mt-6 text-neutral-400 leading-relaxed text-sm md:text-base max-w-md">{ch.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
