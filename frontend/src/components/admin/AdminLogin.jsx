import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { ShieldCheck, LoaderCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLang, copy } from "@/i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatApiErrorDetail(detail) {
  if (detail == null) return null;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

export default function AdminLogin({ onSuccess }) {
  const { lang } = useLang();
  const c = copy[lang].admin;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/admin/login`, { email, password });
      onSuccess(data.token, data.user);
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || c.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 focus:border-gold/70 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors duration-300";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative" data-testid="admin-login-page">
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="glass-strong rounded-[2rem] w-full max-w-md p-8 md:p-10 relative"
      >
        <div className="flex items-center gap-2.5 mb-10">
          <span className="w-2.5 h-2.5 rotate-45 bg-gold" />
          <span className="font-display font-semibold tracking-tight text-lg">VANGUARD</span>
        </div>

        <span className="inline-flex glass rounded-full p-3.5 text-gold mb-6">
          <ShieldCheck size={24} strokeWidth={2} />
        </span>
        <h1 className="font-display font-semibold tracking-tighter text-3xl md:text-4xl" data-testid="admin-login-title">
          {c.loginTitle}
        </h1>
        <p className="mt-2 text-sm text-neutral-500">{c.loginSub}</p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4" data-testid="admin-login-form">
          <input
            data-testid="admin-email-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={c.email}
            className={inputCls}
            autoComplete="username"
          />
          <input
            data-testid="admin-password-input"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={c.password}
            className={inputCls}
            autoComplete="current-password"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400"
              data-testid="admin-login-error"
            >
              {error}
            </motion.p>
          )}
          <button
            data-testid="admin-login-submit"
            type="submit"
            disabled={loading}
            className="mt-1 flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-bright disabled:opacity-60 text-ink font-bold rounded-full px-8 py-3.5 text-sm transition-[transform,background-color] duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading && <LoaderCircle size={16} className="animate-spin" />}
            {loading ? c.loggingIn : c.login}
          </button>
        </form>

        <Link
          to="/"
          data-testid="admin-back-to-site"
          className="mt-8 inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-gold transition-colors duration-300"
        >
          <ArrowLeft size={14} />
          {c.back}
        </Link>
      </motion.div>
    </div>
  );
}
