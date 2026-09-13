import { useEffect, useState } from "react";
import "@/App.css";
import Lenis from "lenis";
import { Toaster } from "sonner";
import { LanguageProvider } from "@/i18n";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Quiz from "@/components/Quiz";

export default function App() {
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
    <LanguageProvider>
      <div className="bg-ink text-white font-body min-h-screen">
        <div className="noise-overlay" aria-hidden="true" />
        <Header onOpenQuiz={() => setQuizOpen(true)} onNavigate={scrollTo} />
        <main>
          <Hero onOpenQuiz={() => setQuizOpen(true)} onNavigate={scrollTo} />
          <Marquee />
          <Services onOpenQuiz={() => setQuizOpen(true)} />
          <About />
          <Contact prefillService={prefillService} />
        </main>
        <Footer />
        <Quiz open={quizOpen} onClose={() => setQuizOpen(false)} onContact={handleQuizContact} />
        <Toaster theme="dark" position="bottom-center" />
      </div>
    </LanguageProvider>
  );
}
