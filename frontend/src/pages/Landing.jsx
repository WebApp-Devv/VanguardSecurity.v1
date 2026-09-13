import { useEffect, useState } from "react";
import Lenis from "lenis";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Quiz from "@/components/Quiz";

function GlowField() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute -top-48 -left-48 w-[34rem] h-[34rem] rounded-full bg-gold/[0.07] blur-[110px]" />
      <div className="absolute top-1/3 -right-56 w-[28rem] h-[28rem] rounded-full bg-gold/[0.05] blur-[100px]" />
      <div className="absolute bottom-[-10rem] left-1/4 w-[24rem] h-[24rem] rounded-full bg-gold/[0.04] blur-[100px]" />
    </div>
  );
}

function Divider() {
  return (
    <div className="relative max-w-7xl mx-auto px-6 md:px-12" aria-hidden="true">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="h-px origin-left bg-[linear-gradient(to_right,transparent,rgba(212,175,55,0.45),transparent)]"
      />
      <motion.span
        initial={{ opacity: 0, rotate: 0, scale: 0 }}
        whileInView={{ opacity: 1, rotate: 135, scale: 1 }}
        viewport={{ once: true, margin: "-15%" }}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="absolute left-1/2 -translate-x-1/2 -top-[5px] w-2.5 h-2.5 bg-gold/70"
      />
    </div>
  );
}

export default function Landing() {
  const [quizOpen, setQuizOpen] = useState(false);
  const [prefillService, setPrefillService] = useState("");

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, anchors: true });
    window.__lenis = lenis;
    let raf;
    const loop = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  useEffect(() => {
    const lenis = window.__lenis;
    if (quizOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [quizOpen]);

  const scrollTo = (hash) => {
    const el = document.querySelector(hash);
    if (!el) return;
    if (window.__lenis) window.__lenis.scrollTo(el, { offset: -90, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  const handleQuizContact = (serviceId) => {
    setPrefillService(serviceId);
    setQuizOpen(false);
    setTimeout(() => scrollTo("#contact"), 80);
  };

  return (
    <div className="bg-ink text-white font-body min-h-screen">
      <div className="noise-overlay" aria-hidden="true" />
      <GlowField />
      <div className="relative z-10">
        <Header onOpenQuiz={() => setQuizOpen(true)} onNavigate={scrollTo} />
        <main>
          <Hero onOpenQuiz={() => setQuizOpen(true)} onNavigate={scrollTo} />
          <Marquee />
          <Services onOpenQuiz={() => setQuizOpen(true)} />
          <Divider />
          <About />
          <Divider />
          <Contact prefillService={prefillService} />
        </main>
        <Footer />
      </div>
      <Quiz open={quizOpen} onClose={() => setQuizOpen(false)} onContact={handleQuizContact} />
    </div>
  );
}
