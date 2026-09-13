import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import {
  LogOut, Search, ClipboardList, Mail, CircleDot, Inbox,
  ChevronDown, Trash2, Eye, EyeOff, Phone, Trophy,
} from "lucide-react";
import { useLang, copy } from "@/i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function AdminDashboard({ token, user, onLogout }) {
  const { lang } = useLang();
  const c = copy[lang].admin;
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const load = useCallback(async () => {
    try {
      const params = {};
      if (filter !== "all") params.type = filter;
      if (q.trim()) params.q = q.trim();
      if (unreadOnly) params.unread = true;
      const [statsRes, leadsRes] = await Promise.all([
        axios.get(`${API}/admin/stats`, { headers }),
        axios.get(`${API}/admin/leads`, { headers, params }),
      ]);
      setStats(statsRes.data);
      setLeads(leadsRes.data.leads);
    } catch (err) {
      if (err.response?.status === 401) onLogout();
      else toast.error(c.loadError);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, q, unreadOnly, token]);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const toggleRead = async (lead) => {
    try {
      await axios.patch(`${API}/admin/leads/${lead.id}`, { read: !lead.read }, { headers });
      setLeads((ls) => ls.map((l) => (l.id === lead.id ? { ...l, read: !lead.read } : l)));
      setStats((s) => s && { ...s, unread: s.unread + (lead.read ? 1 : -1) });
    } catch {
      toast.error(c.loadError);
    }
  };

  const remove = async (lead) => {
    try {
      await axios.delete(`${API}/admin/leads/${lead.id}`, { headers });
      setLeads((ls) => ls.filter((l) => l.id !== lead.id));
      toast.success(c.deleted);
      load();
    } catch {
      toast.error(c.loadError);
    }
  };

  const fmtDate = (iso) =>
    new Date(iso).toLocaleString(lang === "sq" ? "sq-AL" : "en-GB", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });

  const statCards = stats
    ? [
        { label: c.total, value: stats.total, icon: Inbox, testid: "stat-total-leads" },
        { label: c.quiz, value: stats.quiz_leads, icon: Trophy, testid: "stat-quiz-leads" },
        { label: c.contact, value: stats.contact_requests, icon: Mail, testid: "stat-contact-requests" },
        { label: c.unread, value: stats.unread, icon: CircleDot, testid: "stat-unread" },
      ]
    : [];

  const maxService = stats ? Math.max(1, ...Object.values(stats.by_service)) : 1;

  return (
    <div className="relative min-h-screen" data-testid="admin-dashboard">
      <header className="sticky top-0 z-40 px-4 md:px-8 pt-4">
        <div className="glass-strong rounded-full max-w-6xl mx-auto flex items-center justify-between pl-6 pr-3 py-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rotate-45 bg-gold" />
            <span className="font-display font-semibold tracking-tight">VANGUARD</span>
            <span className="hidden sm:inline text-[10px] tracking-[0.25em] uppercase text-gold/70 border border-gold/30 rounded-full px-2.5 py-1">
              {c.badge}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-xs text-neutral-500" data-testid="admin-user-email">{user.email}</span>
            <button
              data-testid="admin-logout-btn"
              onClick={onLogout}
              className="glass rounded-full p-2.5 text-neutral-400 hover:text-gold hover:border-gold/50 transition-colors duration-300"
              aria-label={c.logout}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-10 pb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="text-xs tracking-[0.3em] uppercase text-gold mb-2">{c.overview}</p>
          <h1 className="font-display font-semibold tracking-tight text-3xl md:text-5xl">
            {c.hello}, {user.name}
          </h1>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {statCards.map((s, i) => (
            <motion.div
              key={s.testid}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.08 * i }}
              className="glass rounded-3xl p-5 md:p-6"
              data-testid={s.testid}
            >
              <span className="text-gold"><s.icon size={18} /></span>
              <div className="font-display font-semibold text-3xl md:text-4xl mt-3">{s.value}</div>
              <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {stats && Object.keys(stats.by_service).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="glass rounded-3xl p-6 mt-4"
            data-testid="service-demand-chart"
          >
            <p className="text-xs tracking-[0.25em] uppercase text-neutral-500 mb-5">{c.topServices}</p>
            <div className="flex flex-col gap-3">
              {Object.entries(stats.by_service)
                .sort((a, b) => b[1] - a[1])
                .map(([service, count]) => (
                  <div key={service} className="flex items-center gap-4">
                    <span className="text-sm text-neutral-300 w-44 truncate">{service}</span>
                    <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(count / maxService) * 100}%` }}
                        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full bg-gold rounded-full"
                      />
                    </div>
                    <span className="text-sm text-gold font-semibold w-8 text-right">{count}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

        <div className="mt-10 flex flex-col md:flex-row md:items-center gap-4">
          <div className="glass rounded-full flex p-1 self-start" data-testid="admin-filters">
            {[
              { id: "all", label: c.all },
              { id: "quiz_lead", label: c.quiz },
              { id: "contact", label: c.contact },
              { id: "booking", label: lang === "sq" ? "Rezervime" : "Bookings" },
            ].map((f) => (
              <button
                key={f.id}
                data-testid={`admin-filter-${f.id}`}
                onClick={() => setFilter(f.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-300 ${
                  filter === f.id ? "bg-gold text-ink" : "text-neutral-400 hover:text-white"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              data-testid="admin-search-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={c.search}
              className="w-full bg-white/5 border border-white/10 focus:border-gold/70 rounded-full pl-11 pr-5 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors duration-300"
            />
          </div>
          <button
            data-testid="admin-unread-toggle"
            onClick={() => setUnreadOnly((v) => !v)}
            className={`self-start md:self-auto rounded-full px-4 py-2.5 text-xs font-semibold border transition-colors duration-300 ${
              unreadOnly ? "bg-gold text-ink border-gold" : "glass text-neutral-400 hover:text-white"
            }`}
          >
            {c.unreadOnly}
          </button>
        </div>

        <div className="mt-6 flex flex-col gap-3" data-testid="admin-leads-list">
          {loading ? (
            <div className="glass rounded-3xl p-10 text-center text-neutral-500 text-sm">{c.loading}</div>
          ) : leads.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center text-neutral-500 text-sm" data-testid="admin-leads-empty">
              {c.empty}
            </div>
          ) : (
            leads.map((lead) => (
              <motion.div
                key={lead.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`glass rounded-3xl p-5 md:p-6 ${lead.read ? "opacity-70" : ""}`}
                data-testid={`lead-row-${lead.id}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${lead.read ? "bg-white/20" : "bg-gold"}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-semibold text-white">{lead.name}</span>
                      <span
                        className={`text-[10px] tracking-[0.2em] uppercase rounded-full px-2.5 py-1 border ${
                          lead.type === "quiz_lead"
                            ? "text-gold border-gold/40 bg-gold/10"
                            : "text-neutral-300 border-white/20 bg-white/5"
                        }`}
                      >
                        {lead.type === "quiz_lead" ? "QUIZ" : lead.type === "booking" ? "REZERVIM" : "KONTAKT"}
                      </span>
                      <span className="text-xs text-neutral-500">{fmtDate(lead.created_at)}</span>
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-400">
                      <span className="truncate">{lead.email}</span>
                      {lead.phone && (
                        <span className="inline-flex items-center gap-1.5">
                          <Phone size={12} /> {lead.phone}
                        </span>
                      )}
                      {(lead.recommended_service || lead.service) && (
                        <span className="text-gold/90">
                          {c.recommended}: {lead.recommended_service || lead.service}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      data-testid={`lead-read-toggle-${lead.id}`}
                      onClick={() => toggleRead(lead)}
                      className="glass rounded-full p-2 text-neutral-400 hover:text-gold transition-colors duration-300"
                      aria-label={lead.read ? c.markUnread : c.markRead}
                    >
                      {lead.read ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      data-testid={`lead-delete-${lead.id}`}
                      onClick={() => remove(lead)}
                      className="glass rounded-full p-2 text-neutral-400 hover:text-red-400 transition-colors duration-300"
                      aria-label={c.delete}
                    >
                      <Trash2 size={14} />
                    </button>
                    <button
                      data-testid={`lead-expand-${lead.id}`}
                      onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                      className="glass rounded-full p-2 text-neutral-400 hover:text-white transition-colors duration-300"
                      aria-label="Expand"
                    >
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${expanded === lead.id ? "rotate-180" : ""}`}
                      />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {expanded === lead.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="mt-5 pt-5 border-t border-white/10 pl-6" data-testid={`lead-details-${lead.id}`}>
                        {lead.message && (
                          <div className="mb-3">
                            <p className="text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-1.5">{c.message}</p>
                            <p className="text-sm text-neutral-300 leading-relaxed">{lead.message}</p>
                          </div>
                        )}
                        {lead.answers?.length > 0 && (
                          <div>
                            <p className="text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-1.5">{c.answers}</p>
                            <ul className="flex flex-col gap-1.5">
                              {lead.answers.map((a, i) => (
                                <li key={i} className="text-xs text-neutral-400 leading-relaxed flex gap-2">
                                  <ClipboardList size={12} className="text-gold/60 mt-0.5 shrink-0" />
                                  {a}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
