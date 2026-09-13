import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ShieldCheck } from "lucide-react";
import { useLang, SERVICES } from "@/i18n";
import { BENEFITS, SERVICE_IMAGES, SERVICE_PAGE } from "@/servicesContent";
import LeadForm from "@/components/LeadForm";

export default function ServicePage() {
  const { id } = useParams();
  const { lang, setLang } = useLang();
  const service = SERVICES.find((s) => s.id === id);

  if (!service) return <Navigate to="/" replace />;

  const p = SERVICE_PAGE[lang];
  const benefits = BENEFITS[id][lang];

  const scrollToBooking = () =>
    document.getElementById("rezervo")?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="bg-ink text-white font-body min-h-screen" data-testid="service-page">
      <div className="noise-overlay" aria-hidden="true" />

      <header className="fixed top-0 inset-x-0 z-40 px-4 md:px-8 pt-4">
        <div className="glass-strong rounded-full max-w-7xl mx-auto flex items-center justify-between pl-6 pr-3 py-3">
          <Link to="/" data-testid="service-logo-link" className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-gold" />
            <span className="font-display font-semibold tracking-tight text-lg">VANGUARD</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="glass rounded-full flex p-1">
              {["sq", "en"].map((l) => (
                <button
                  key={l}
                  data-testid={`service-lang-${l}`}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase transition-colors duration-300 ${
                    lang === l ? "bg-gold text-ink" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
            <Link
              to="/"
              data-testid="service-back-link"
              className="glass rounded-full px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-gold hover:border-gold/50 transition-colors duration-300 inline-flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">{p.back}</span>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative min-h-[62vh] flex items-end overflow-hidden">
        <img
          src={SERVICE_IMAGES[id]}
          alt={service.name[lang]}
          className="absolute inset-0 w-full h-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#050505_8%,rgba(5,5,5,0.55)_55%,rgba(5,5,5,0.35))]" />
        <div className="absolute inset-0 gold-radial" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-44 pb-14 w-full">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-display text-sm tracking-[0.35em] text-gold/80"
          >
            {service.number}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-semibold tracking-tighter text-4xl md:text-6xl mt-3"
            data-testid="service-title"
          >
            {service.name[lang]}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-7 max-w-xl text-neutral-300 leading-relaxed text-sm md:text-base"
          >
            {service.desc[lang]}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8"
          >
            <button
              data-testid="service-booking-cta"
              onClick={scrollToBooking}
              className="inline-flex items-center gap-3 bg-gold hover:bg-gold-bright text-ink font-bold rounded-full px-8 py-4 text-sm md:text-base transition-[transform,background-color] duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-[0_0_50px_rgba(212,175,55,0.25)]"
            >
              <ShieldCheck size={18} strokeWidth={2.5} />
              {p.cta}
            </button>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 md:py-20" data-testid="service-benefits">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-xs tracking-[0.3em] uppercase text-gold mb-8"
          >
            {p.benefitsTitle}
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="service-benefits-list">
            {benefits.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="glass rounded-2xl px-6 py-5 flex items-center gap-4"
                data-testid={`benefit-item-${i}`}
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-gold/15 border border-gold/40 flex items-center justify-center text-gold">
                  <Check size={15} strokeWidth={3} />
                </span>
                <span className="text-sm md:text-base text-neutral-200 leading-snug">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="rezervo" className="relative py-16 md:py-24" data-testid="rezervo-section">
        <div className="absolute inset-0 gold-radial opacity-60" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xs tracking-[0.3em] uppercase text-gold mb-4">{service.name[lang]}</p>
            <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-6xl" data-testid="rezervo-title">
              {p.bookingTitle}
            </h2>
            <p className="mt-5 text-neutral-400 leading-relaxed max-w-md text-sm md:text-base">{p.bookingText}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <LeadForm
              endpoint="/booking"
              buildExtra={() => ({ service: service.name.en })}
              title={p.formTitle}
              text={p.formText}
              submitLabel={p.cta}
              testPrefix="booking"
            />
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          <span className="font-display font-semibold tracking-tight text-sm text-neutral-400">VANGUARD</span>
          <Link
            to="/"
            data-testid="service-footer-back"
            className="text-xs text-neutral-500 hover:text-gold transition-colors duration-300 inline-flex items-center gap-2"
          >
            <ArrowLeft size={12} />
            {p.back}
          </Link>
        </div>
      </footer>
    </div>
  );
}
