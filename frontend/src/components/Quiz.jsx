import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { X, ShieldCheck, LoaderCircle, RotateCcw, Send, Check } from "lucide-react";
import { useLang, copy, SERVICES } from "@/i18n";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const QUESTIONS = [
  {
    q: { en: "What do you need to protect most?", sq: "Çfarë keni më shumë nevojë të mbroni?" },
    options: [
      { en: "My business or property", sq: "Biznesin ose pronën time", scores: { physical: 2 } },
      { en: "Myself or my family", sq: "Veten ose familjen time", scores: { close_protection: 2 } },
      { en: "An event I'm organizing", sq: "Një event që po organizoj", scores: { event: 2 } },
      { en: "Multiple sites, always moving", sq: "Disa lokacione, gjithmonë në lëvizje", scores: { patrol: 2 } },
    ],
  },
  {
    q: { en: "What worries you most?", sq: "Çfarë ju shqetëson më shumë?" },
    options: [
      { en: "Break-ins and theft", sq: "Thyerjet dhe vjedhjet", scores: { physical: 1, surveillance: 1 } },
      { en: "Personal threats", sq: "Kërcënimet personale", scores: { close_protection: 2 } },
      { en: "Crowd-related incidents", sq: "Incidentet me turma", scores: { event: 2 } },
      { en: "Not knowing what happens when I'm away", sq: "Nuk e di çka ndodh kur mungoj", scores: { surveillance: 1, patrol: 1 } },
    ],
  },
  {
    q: { en: "How do you feel about security technology?", sq: "Si i qëndroni teknologjisë së sigurisë?" },
    options: [
      { en: "Cameras and alarms everywhere", sq: "Kamera e alarme kudo", scores: { surveillance: 2 } },
      { en: "A smart system with 24/7 monitoring", sq: "Sistem i mençur me monitorim 24/7", scores: { surveillance: 2 } },
      { en: "Technology plus human presence", sq: "Teknologji plus prezencë njerëzore", scores: { surveillance: 1, physical: 1 } },
      { en: "Not my priority", sq: "Nuk është prioriteti im", scores: { physical: 1 } },
    ],
  },
  {
    q: { en: "Are you planning an event?", sq: "Po planifikoni ndonjë event?" },
    options: [
      { en: "A sports match — football, boxing, basketball, handball", sq: "Ndeshje sportive — futboll, boks, basketboll, hendboll", scores: { event: 2 } },
      { en: "A concert or festival", sq: "Koncert apo festival", scores: { event: 2 } },
      { en: "A private business event", sq: "Event privat biznesi", scores: { event: 1, close_protection: 1 } },
      { en: "No event planned", sq: "Jo, s'kam event", scores: { physical: 1 } },
    ],
  },
  {
    q: { en: "How visible should your security be?", sq: "Sa e dukshme duhet të jetë siguria juaj?" },
    options: [
      { en: "Uniformed and visible", sq: "Uniformuar dhe e dukshme", scores: { physical: 1, patrol: 1 } },
      { en: "Discreet and invisible", sq: "Diskrete dhe e padukshme", scores: { close_protection: 2 } },
      { en: "Remote, behind the scenes", sq: "Në distancë, prapë skenave", scores: { surveillance: 2 } },
      { en: "Commanding a crowd", sq: "Duke drejtuar turmën", scores: { event: 1 } },
    ],
  },
  {
    q: { en: "What coverage do you need?", sq: "Çfarë mbulimi ju nevojitet?" },
    options: [
      { en: "24/7, every day", sq: "24/7, çdo ditë", scores: { physical: 1, surveillance: 1 } },
      { en: "Only during specific events", sq: "Vetëm gjatë eventeve të caktuara", scores: { event: 2 } },
      { en: "Business hours only", sq: "Vetëm gjatë orarit të punës", scores: { physical: 1 } },
      { en: "Random mobile checks", sq: "Kontrolle mobile të rastësishme", scores: { patrol: 2 } },
    ],
  },
  {
    q: { en: "Do you travel often or face public exposure?", sq: "Udhëtoni shpesh ose jeni i ekspozuar publikisht?" },
    options: [
      { en: "Yes, constantly", sq: "Po, vazhdimisht", scores: { close_protection: 2 } },
      { en: "Occasionally", sq: "Herë pas here", scores: { close_protection: 1 } },
      { en: "Rarely — I'm mostly at one location", sq: "Rrallë — zakonisht jam në një vend", scores: { physical: 1 } },
      { en: "Only for events", sq: "Vetëm për evente", scores: { event: 1 } },
    ],
  },
  {
    q: { en: "How large is the area to protect?", sq: "Sa e madhe është hapësira që mbrohet?" },
    options: [
      { en: "A single building", sq: "Një objekt i vetëm", scores: { physical: 1 } },
      { en: "A large complex or multiple sites", sq: "Kompleks i madh ose disa objekte", scores: { physical: 1, patrol: 1 } },
      { en: "A stadium, arena or venue", sq: "Stadium, arenë apo hapësirë eventi", scores: { event: 2 } },
      { en: "Wherever I go", sq: "Kudo që shkoj", scores: { close_protection: 2 } },
    ],
  },
  {
    q: { en: "How fast do you need response when something happens?", sq: "Sa shpejt ju nevojitet reagim kur ndodh diçka?" },
    options: [
      { en: "Within minutes — rapid intervention", sq: "Brenda minutave — intervenim i shpejtë", scores: { patrol: 2 } },
      { en: "Instant alarm notification", sq: "Njoftim i menjëhershëm nga alarmi", scores: { surveillance: 2 } },
      { en: "Immediate on-site presence", sq: "Prezencë e menjëhershme në terren", scores: { physical: 1, event: 1 } },
      { en: "Someone always beside me", sq: "Dikush gjithmonë pranë meje", scores: { close_protection: 1 } },
    ],
  },
  {
    q: { en: "What matters most in a security partner?", sq: "Çfarë vlerësoni më shumë te një partner sigurie?" },
    options: [
      { en: "Elite, tailored personal service", sq: "Shërbim elitar i personalizuar", scores: { close_protection: 1 } },
      { en: "Cutting-edge technology", sq: "Teknologji e avancuar", scores: { surveillance: 1 } },
      { en: "Experience with big crowds", sq: "Përvojë me turma të mëdha", scores: { event: 1 } },
      { en: "Reliability and constant presence", sq: "Besueshmëri dhe prezencë konstante", scores: { physical: 1, patrol: 1 } },
    ],
  },
];

const TIEBREAK = ["event", "physical", "close_protection", "surveillance", "patrol"];

export default function Quiz({ open, onClose, onContact }) {
  const { lang } = useLang();
  const c = copy[lang].quiz;
  const [phase, setPhase] = useState("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loadStep, setLoadStep] = useState(0);
  const [result, setResult] = useState(null);
  const [lead, setLead] = useState({ name: "", email: "", phone: "" });
  const [leadState, setLeadState] = useState("idle");
  const busyRef = useRef(false);
  const countRef = useRef(0);
  const [advancing, setAdvancing] = useState(false);

  useEffect(() => {
    if (open) {
      setPhase("intro");
      setIndex(0);
      setAnswers([]);
      setSelected(null);
      setLoadStep(0);
      setResult(null);
      setLead({ name: "", email: "", phone: "" });
      setLeadState("idle");
      busyRef.current = false;
      countRef.current = 0;
      setAdvancing(false);
    }
  }, [open]);

  useEffect(() => {
    if (phase !== "loading") return;
    const interval = setInterval(() => setLoadStep((s) => (s + 1) % c.loading.length), 750);
    const done = setTimeout(() => {
      setResult(computeResult(answers));
      setPhase("result");
    }, 3100);
    return () => {
      clearInterval(interval);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const computeResult = (ans) => {
    const totals = {};
    ans.forEach((a) => {
      Object.entries(a.scores).forEach(([k, v]) => {
        totals[k] = (totals[k] || 0) + v;
      });
    });
    let best = TIEBREAK[0];
    let bestScore = -1;
    TIEBREAK.forEach((id) => {
      if ((totals[id] || 0) > bestScore) {
        bestScore = totals[id] || 0;
        best = id;
      }
    });
    return SERVICES.find((s) => s.id === best);
  };

  const progress = useMemo(() => Math.round((index / QUESTIONS.length) * 100), [index]);

  const pick = (opt, optIdx) => {
    if (busyRef.current) return;
    busyRef.current = true;
    setAdvancing(true);
    setSelected(optIdx);
    const qIndex = countRef.current;
    countRef.current += 1;
    const q = QUESTIONS[qIndex];
    setAnswers((prev) => [...prev, { question: q.q.en, answer: opt.en, scores: opt.scores }]);
    setTimeout(() => {
      busyRef.current = false;
      setSelected(null);
      setAdvancing(false);
      if (countRef.current >= QUESTIONS.length) {
        setPhase("loading");
      } else {
        setIndex(countRef.current);
      }
    }, 420);
  };

  const submitLead = async (e) => {
    e.preventDefault();
    setLeadState("sending");
    try {
      await axios.post(`${API}/quiz-lead`, {
        ...lead,
        recommended_service: result.name.en,
        answers: answers.map((a, i) => `Q${i + 1} ${a.question} — ${a.answer}`),
      });
      setLeadState("sent");
      toast.success(c.sent);
    } catch {
      setLeadState("idle");
      toast.error(c.error);
    }
  };

  const inputCls =
    "w-full bg-white/5 border border-white/10 focus:border-gold/70 rounded-2xl px-5 py-3.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors duration-300";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-4 md:p-8"
          data-testid="quiz-modal"
        >
          <div className="absolute inset-0 gold-radial" />
          <button
            data-testid="quiz-close-btn"
            onClick={onClose}
            className="absolute top-5 right-5 md:top-8 md:right-8 glass rounded-full p-3 text-neutral-400 hover:text-white hover:border-gold/50 transition-colors duration-300 z-10"
            aria-label="Close quiz"
          >
            <X size={18} />
          </button>

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative glass-strong rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-7 md:p-12"
          >
            <AnimatePresence mode="wait">
              {phase === "intro" && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45 }}
                  className="text-center"
                >
                  <span className="inline-flex glass rounded-full p-4 text-gold mb-8">
                    <ShieldCheck size={28} strokeWidth={2} />
                  </span>
                  <h2 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl" data-testid="quiz-intro-title">
                    {c.introTitle}
                  </h2>
                  <p className="mt-5 text-neutral-400 leading-relaxed max-w-md mx-auto text-sm md:text-base">{c.introText}</p>
                  <p className="mt-3 text-xs tracking-[0.2em] uppercase text-gold/70">{c.introMeta}</p>
                  <button
                    data-testid="quiz-start-btn"
                    onClick={() => setPhase("quiz")}
                    className="mt-9 bg-gold hover:bg-gold-bright text-ink font-bold rounded-full px-10 py-4 transition-[transform,background-color] duration-300 hover:scale-[1.04] active:scale-[0.98]"
                  >
                    {c.start}
                  </button>
                </motion.div>
              )}

              {phase === "quiz" && (
                <motion.div
                  key={`q-${index}`}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs tracking-[0.25em] uppercase text-neutral-500" data-testid="quiz-progress-label">
                      {String(index + 1).padStart(2, "0")} {c.questionOf} {QUESTIONS.length}
                    </span>
                    <span className="text-xs text-gold font-semibold">{progress}%</span>
                  </div>
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden mb-9" data-testid="quiz-progress-bar">
                    <motion.div
                      className="h-full bg-gold rounded-full"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>

                  <h3 className="font-display font-semibold tracking-tight text-2xl md:text-3xl leading-snug" data-testid="quiz-question">
                    {QUESTIONS[index].q[lang]}
                  </h3>

                  <div className="mt-8 flex flex-col gap-3">
                    {QUESTIONS[index].options.map((opt, i) => (
                      <button
                        key={i}
                        data-testid={`quiz-option-${i}`}
                        onClick={() => pick(opt, i)}
                        className={`group text-left rounded-2xl border px-6 py-4 text-sm md:text-base transition-[color,background-color,border-color,transform] duration-300 hover:scale-[1.01] ${
                          advancing ? "pointer-events-none" : ""
                        } ${
                          selected === i
                            ? "bg-gold text-ink border-gold font-semibold"
                            : "glass text-neutral-200 hover:border-gold/50 hover:text-white"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-4">
                          {opt[lang]}
                          {selected === i && <Check size={18} strokeWidth={3} />}
                        </span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {phase === "loading" && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                  data-testid="quiz-loading"
                >
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full border border-gold/40 animate-pulse-ring" />
                    <span className="glass rounded-full p-6 text-gold inline-flex">
                      <LoaderCircle size={34} className="animate-spin" />
                    </span>
                  </div>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={loadStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="mt-8 text-neutral-300 text-sm md:text-base tracking-wide"
                      data-testid="quiz-loading-text"
                    >
                      {c.loading[loadStep]}
                    </motion.p>
                  </AnimatePresence>
                </motion.div>
              )}

              {phase === "result" && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  data-testid="quiz-result"
                >
                  <p className="text-xs tracking-[0.3em] uppercase text-gold/80 text-center">{c.resultEyebrow}</p>
                  <h3 className="font-display font-semibold tracking-tighter text-4xl md:text-5xl text-center mt-4" data-testid="quiz-result-title">
                    {c.resultTitle}{" "}
                    <span className="text-gold italic">{result.name[lang]}</span>
                  </h3>
                  <p className="mt-5 text-neutral-400 leading-relaxed text-sm md:text-base max-w-lg mx-auto text-center">
                    {result.result[lang]}
                  </p>

                  {leadState !== "sent" ? (
                    <form onSubmit={submitLead} className="mt-9 glass rounded-3xl p-6 md:p-7" data-testid="quiz-lead-form">
                      <p className="font-semibold text-sm md:text-base">{c.leadTitle}</p>
                      <p className="text-xs text-neutral-500 mt-1 mb-5">{c.leadText}</p>
                      <div className="flex flex-col gap-3">
                        <input
                          data-testid="quiz-lead-name-input"
                          required
                          value={lead.name}
                          onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))}
                          placeholder={c.name}
                          className={inputCls}
                        />
                        <input
                          data-testid="quiz-lead-email-input"
                          required
                          type="email"
                          value={lead.email}
                          onChange={(e) => setLead((l) => ({ ...l, email: e.target.value }))}
                          placeholder={c.email}
                          className={inputCls}
                        />
                        <input
                          data-testid="quiz-lead-phone-input"
                          value={lead.phone}
                          onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value }))}
                          placeholder={c.phone}
                          className={inputCls}
                        />
                        <button
                          data-testid="quiz-lead-submit-btn"
                          type="submit"
                          disabled={leadState === "sending"}
                          className="mt-1 flex items-center justify-center gap-2.5 bg-gold hover:bg-gold-bright disabled:opacity-60 text-ink font-bold rounded-full px-8 py-3.5 text-sm transition-[transform,background-color] duration-300 hover:scale-[1.02]"
                        >
                          {leadState === "sending" ? <LoaderCircle size={16} className="animate-spin" /> : <Send size={16} />}
                          {leadState === "sending" ? c.sending : c.submit}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="mt-9 glass rounded-3xl p-6 text-center text-gold text-sm font-semibold" data-testid="quiz-lead-success">
                      {c.sent}
                    </div>
                  )}

                  <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      data-testid="quiz-contact-btn"
                      onClick={() => onContact(result.id)}
                      className="bg-gold hover:bg-gold-bright text-ink font-bold rounded-full px-9 py-3.5 text-sm transition-[transform,background-color] duration-300 hover:scale-[1.03]"
                    >
                      {c.contact}
                    </button>
                    <button
                      data-testid="quiz-retake-btn"
                      onClick={() => {
                        setPhase("intro");
                        setIndex(0);
                        setAnswers([]);
                        setResult(null);
                      }}
                      className="flex items-center gap-2 text-neutral-500 hover:text-gold text-sm transition-colors duration-300"
                    >
                      <RotateCcw size={14} />
                      {c.retake}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
