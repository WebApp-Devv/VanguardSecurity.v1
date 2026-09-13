import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { MapPin, Mail, Phone, Send, LoaderCircle } from "lucide-react";
import { useLang, copy, SERVICES } from "@/i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const ICONS = [MapPin, Mail, Phone];

export default function Contact({ prefillService }) {
  const { lang } = useLang();
  const c = copy[lang].contact;
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (prefillService) setForm((f) => ({ ...f, service: prefillService }));
  }, [prefillService]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const serviceName = SERVICES.find((s) => s.id === form.service)?.name.en || form.service;
      await axios.post(`${API}/contact`, { ...form, service: serviceName });
      toast.success(c.success);
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch {
      toast.error(c.error);
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 focus:border-gold/70 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors duration-300";

  return (
    <section id="contact" className="relative py-28 md:py-36" data-testid="contact-section">
      <div className="absolute inset-0 gold-radial opacity-60" />
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
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
            className="font-display font-semibold tracking-tighter text-4xl md:text-6xl leading-[1.02]"
            data-testid="contact-title"
          >
            {c.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-neutral-400 leading-relaxed max-w-md text-sm md:text-base"
          >
            {c.text}
          </motion.p>

          <div className="mt-12 flex flex-col gap-5">
            {c.details.map((d, i) => {
              const Icon = ICONS[i];
              return (
                <motion.div
                  key={d.label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.25 + i * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <span className="glass rounded-full p-3 text-gold">
                    <Icon size={18} />
                  </span>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-neutral-500">{d.label}</div>
                    <div className="text-sm text-white mt-0.5">{d.value}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="glass rounded-[2rem] p-8 md:p-10 flex flex-col gap-5"
          data-testid="contact-form"
        >
          <input
            data-testid="contact-name-input"
            required
            value={form.name}
            onChange={set("name")}
            placeholder={c.name}
            className={inputCls}
          />
          <input
            data-testid="contact-email-input"
            required
            type="email"
            value={form.email}
            onChange={set("email")}
            placeholder={c.email}
            className={inputCls}
          />
          <input
            data-testid="contact-phone-input"
            value={form.phone}
            onChange={set("phone")}
            placeholder={c.phone}
            className={inputCls}
          />
          <select
            data-testid="contact-service-select"
            value={form.service}
            onChange={set("service")}
            className={`${inputCls} appearance-none cursor-pointer ${form.service ? "" : "text-neutral-500"}`}
          >
            <option value="" className="bg-surface">{c.servicePlaceholder}</option>
            {SERVICES.map((s) => (
              <option key={s.id} value={s.id} className="bg-surface">
                {s.name[lang]}
              </option>
            ))}
          </select>
          <textarea
            data-testid="contact-message-input"
            required
            rows={4}
            value={form.message}
            onChange={set("message")}
            placeholder={c.message}
            className={`${inputCls} resize-none`}
          />
          <button
            data-testid="contact-submit-button"
            type="submit"
            disabled={sending}
            className="mt-2 flex items-center justify-center gap-3 bg-gold hover:bg-gold-bright disabled:opacity-60 text-ink font-bold rounded-full px-8 py-4 transition-[transform,background-color] duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {sending ? <LoaderCircle size={18} className="animate-spin" /> : <Send size={18} />}
            {sending ? c.sending : c.submit}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
