import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { Send, LoaderCircle, Check } from "lucide-react";
import { useLang, copy } from "@/i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LeadForm({ endpoint, buildExtra, title, text, submitLabel, testPrefix, className = "" }) {
  const { lang } = useLang();
  const c = copy[lang].quiz;
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [state, setState] = useState("idle");

  const inputCls =
    "w-full bg-white/5 border border-white/10 focus:border-gold/70 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors duration-300";

  const submit = async (e) => {
    e.preventDefault();
    setState("sending");
    try {
      await axios.post(`${API}${endpoint}`, { ...lead, ...buildExtra() });
      setState("sent");
      toast.success(c.sent);
    } catch {
      setState("idle");
      toast.error(c.error);
    }
  };

  if (state === "sent") {
    return (
      <div
        className={`glass-panel rounded-3xl p-8 text-center ${className}`}
        data-testid={`${testPrefix}-success`}
      >
        <span className="inline-flex glass rounded-full p-3.5 text-gold mb-4">
          <Check size={22} strokeWidth={2.5} />
        </span>
        <p className="text-gold text-sm font-semibold">{c.sent}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className={`glass-panel rounded-3xl p-6 md:p-7 ${className}`} data-testid={`${testPrefix}-form`}>
      <p className="font-semibold text-sm md:text-base">{title}</p>
      <p className="text-xs text-neutral-500 mt-1 mb-5">{text}</p>
      <div className="flex flex-col gap-3">
        <input
          data-testid={`${testPrefix}-name-input`}
          required
          value={lead.name}
          onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
          placeholder={c.name}
          className={inputCls}
        />
        <input
          data-testid={`${testPrefix}-email-input`}
          required
          type="email"
          value={lead.email}
          onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
          placeholder={c.email}
          className={inputCls}
        />
        <input
          data-testid={`${testPrefix}-phone-input`}
          value={lead.phone}
          onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))}
          placeholder={c.phone}
          className={inputCls}
        />
        <button
          data-testid={`${testPrefix}-submit-btn`}
          type="submit"
          disabled={state === "sending"}
          className="mt-1 flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-bright disabled:opacity-60 text-ink font-bold rounded-full px-8 py-3.5 text-sm transition-[transform,background-color] duration-300 hover:scale-[1.02]"
        >
          {state === "sending" ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
          {state === "sending" ? c.sending : submitLabel || c.submit}
        </button>
      </div>
    </form>
  );
}
