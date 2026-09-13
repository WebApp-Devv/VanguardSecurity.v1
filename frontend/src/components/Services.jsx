import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useLang, copy, SERVICES } from "@/i18n";

const IMAGES = {
  event:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80&w=1800",
  close_protection:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200",
  physical:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200",
  surveillance:
    "https://images.unsplash.com/photo-1776639257282-35eda08588bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxzZWN1cml0eSUyMGNhbWVyYSUyMGRhcmslMjBtb2Rlcm58ZW58MHx8fHwxNzg5MzA2NDM2fDA&ixlib=rb-4.1.0&q=85",
  patrol:
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1200",
};

const cardVariants = {
  hidden: { opacity: 0, y: 48 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  }),
};

function ServiceCard({ service, index, featured, lang }) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      data-testid={`service-card-${service.id}`}
      className={`group relative overflow-hidden rounded-[2rem] border border-white/10 hover:border-gold/40 transition-colors duration-500 ${
        featured ? "md:col-span-7 min-h-[460px]" : "md:col-span-5 lg:col-span-4 min-h-[380px]"
      }`}
    >
      <img
        src={IMAGES[service.id]}
        alt={service.name[lang]}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(5,5,5,0.95),rgba(5,5,5,0.35)_55%,rgba(5,5,5,0.15))]" />

      <div className="relative z-10 h-full flex flex-col justify-end p-7 md:p-9">
        <span className="absolute top-6 left-7 font-display text-sm tracking-[0.3em] text-gold/80">
          {service.number}
        </span>
        <span className="absolute top-6 right-6 glass rounded-full p-2.5 text-neutral-300 group-hover:text-gold group-hover:border-gold/50 transition-colors duration-300">
          <ArrowUpRight size={16} />
        </span>

        <h3 className={`font-display font-semibold tracking-tight drop-shadow-md ${featured ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>
          {service.name[lang]}
        </h3>
        <p className={`mt-3 text-neutral-300 leading-relaxed drop-shadow ${featured ? "text-sm md:text-base max-w-xl" : "text-sm"}`}>
          {service.desc[lang]}
        </p>
        {featured && (
          <div className="mt-5 flex flex-wrap gap-2">
            {service.tags[lang].map((t) => (
              <span key={t} className="glass rounded-full px-3.5 py-1.5 text-xs text-gold/90 border-gold/20">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}

export default function Services({ onOpenQuiz }) {
  const { lang } = useLang();
  const c = copy[lang].services;
  const featured = SERVICES.find((s) => s.featured);
  const rest = SERVICES.filter((s) => !s.featured);

  return (
    <section id="services" className="relative py-28 md:py-36" data-testid="services-section">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
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
              className="font-display font-semibold tracking-tighter text-4xl md:text-6xl"
              data-testid="services-title"
            >
              {c.title}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-500 text-sm md:text-base max-w-xs md:text-right"
          >
            {c.note}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <ServiceCard service={featured} index={0} featured lang={lang} />
          <ServiceCard service={rest[0]} index={1} lang={lang} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-6">
          {rest.slice(1).map((s, i) => (
            <ServiceCard key={s.id} service={s} index={i + 2} lang={lang} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-14 flex justify-center"
        >
          <button
            data-testid="services-choose-vanguard-btn"
            onClick={onOpenQuiz}
            className="glass rounded-full px-8 py-4 font-semibold text-gold border-gold/30 hover:bg-gold hover:text-ink transition-[color,background-color,border-color] duration-300"
          >
            {copy[lang].nav.cta}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
