import { createContext, useContext, useState } from "react";

const LanguageContext = createContext({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);

export const SERVICES = [
  {
    id: "event",
    number: "01",
    featured: true,
    name: { en: "Event Security", sq: "Siguria e Eventeve" },
    desc: {
      en: "Stadiums, arenas and stages. Football, boxing, basketball and handball matches, concerts and private business events — we command the crowd so the show never stops.",
      sq: "Stadiume, arena dhe skena. Ndeshje futbolli, boksi, basketbolli e hendbollit, koncerte dhe evente private biznesi — ne drejtojmë turmën që spektakli të mos ndalet kurrë.",
    },
    tags: {
      en: ["Football Matches", "Boxing Nights", "Basketball", "Handball", "Concerts", "Business Events"],
      sq: ["Ndeshje Futbolli", "Netë Boksi", "Basketboll", "Hendboll", "Koncerte", "Evente Biznesi"],
    },
    result: {
      en: "Your profile points to large gatherings and live moments. Our event teams specialize in crowd dynamics, access control and rapid on-site response for sports matches, concerts and private functions.",
      sq: "Profili juaj tregon drejt tubimeve të mëdha dhe momenteve live. Ekipet tona të eventeve specializohen në dinamikën e turmës, kontrollin e hyrjeve dhe reagim të shpejtë në terren për ndeshje sportive, koncerte dhe evente private.",
    },
  },
  {
    id: "close_protection",
    number: "02",
    name: { en: "Close Protection", sq: "Mbrojtje e Afërt Personale" },
    desc: {
      en: "Elite personal protection for executives, public figures and families. Discreet, precise, always one step ahead.",
      sq: "Mbrojtje personale elitare për drejtues, figura publike dhe familje. Diskrete, precize, gjithmonë një hap përpara.",
    },
    tags: { en: ["Executives", "Public Figures", "Family Office"], sq: ["Drejtues", "Figura Publike", "Familje"] },
    result: {
      en: "Your answers point to personal exposure. Our close protection officers operate discreetly around your life — travel, appearances and family — so you move freely while we carry the risk.",
      sq: "Përgjigjet tuaja tregojnë ekspozim personal. Oficerët tanë të mbrojtjes së afërt operojnë diskretë rreth jetës suaj — udhëtime, paraqitje e familje — që ju të lëvizni lirisht ndërsa ne mbajmë rrezikun.",
    },
  },
  {
    id: "physical",
    number: "03",
    name: { en: "Physical Security", sq: "Siguria Fizike" },
    desc: {
      en: "Static guarding for facilities, businesses and residences — trained officers, visible deterrence, total control of every access point.",
      sq: "Roje statike për objekte, biznese dhe rezidenca — oficerë të trajnuar, parandalim i dukshëm, kontroll total i çdo pike hyrjeje.",
    },
    tags: { en: ["Businesses", "Facilities", "Residences"], sq: ["Biznese", "Objekte", "Rezidenca"] },
    result: {
      en: "Your priority is a fixed location under constant watch. Our physical security officers hold the line at your property — access control, deterrence and immediate response, around the clock.",
      sq: "Prioriteti juaj është një lokacion i fiksuar nën vëzhgim të vazhdueshëm. Oficerët tanë të sigurisë fizike e mbajë vijën e mbrojtjes në pronën tuaj — kontroll hyrjesh, parandalim dhe reagim i menjëhershëm, pa pushim.",
    },
  },
  {
    id: "surveillance",
    number: "04",
    name: { en: "Alarms & Surveillance", sq: "Alarme & Kamera Sigurie" },
    desc: {
      en: "Smart alarm systems and CCTV networks, monitored around the clock. Technology that never blinks.",
      sq: "Sisteme të mençura alarmi dhe rrjete kamerash, të monitoruara pa pushim. Teknologji që nuk mbyll sy kurrë.",
    },
    tags: { en: ["CCTV Networks", "Smart Alarms", "24/7 Monitoring"], sq: ["Rrjete Kamerash", "Alarme të Mençura", "Monitorim 24/7"] },
    result: {
      en: "You think in systems, not just guards. Our alarm and camera networks give you total visibility over your property — with monitoring that reacts the instant something moves.",
      sq: "Ju mendoni në sisteme, jo vetëm roje. Rrjetet tona të alarmeve dhe kamerave ju japin dukshmëri totale mbi pronën tuaj — me monitorim që reagon në çastin që lëviz diçka.",
    },
  },
  {
    id: "patrol",
    number: "05",
    name: { en: "Patrol & Intervention", sq: "Patrullim & Intervenim" },
    desc: {
      en: "Mobile patrol units and rapid response across multiple sites. When an alarm triggers, we are already on the way.",
      sq: "Njësi mobile patrullimi dhe reagim i shpejtë në shumë lokacione. Kur alarmi aktivizohet, ne jemi tashmë në rrugë.",
    },
    tags: { en: ["Mobile Units", "Rapid Response", "Multi-Site"], sq: ["Njësi Mobile", "Reagim i Shpejtë", "Shumë Lokacione"] },
    result: {
      en: "You need coverage in motion, not a fixed post. Our patrol units sweep your sites on unpredictable routes and intervene within minutes when anything triggers.",
      sq: "Ju nevojitet mbulim në lëvizje, jo një postë fikse. Njësitet tona të patrullimit kalojnë objektet tuaja në rrugë të paparashikueshme dhe intervenojnë brenda minutave kur diçka aktivizohet.",
    },
  },
];

export const copy = {
  en: {
    nav: { services: "Services", about: "About", contact: "Contact", cta: "Choose Your Vanguard" },
    hero: {
      eyebrow: "Private Security — Est. for the few who expect more",
      line1: "Absolute security.",
      line2: "Zero compromise.",
      sub: "Physical protection, close protection, event security, surveillance and rapid intervention — engineered around the life you refuse to put at risk.",
      ctaPrimary: "Choose Your Vanguard",
      ctaSecondary: "Explore Services",
      stats: [
        { value: "500+", label: "Operations secured" },
        { value: "24/7", label: "Response readiness" },
        { value: "15+", label: "Years on the ground" },
      ],
    },
    marquee: ["PHYSICAL SECURITY", "CLOSE PROTECTION", "EVENT SECURITY", "SURVEILLANCE", "RAPID INTERVENTION"],
    services: {
      eyebrow: "What we do",
      title: "Five disciplines. One standard.",
      note: "Every engagement is built from scratch — no templates, no shortcuts.",
    },
    about: {
      eyebrow: "The Vanguard manifesto",
      title: "We are the line between order and chaos.",
      intro: "Vanguard Security was founded on a simple conviction: protection is not a product you buy, it is a standard you live by. Our officers come from military, law-enforcement and elite event backgrounds — selected, vetted and drilled to one measure.",
      chapters: [
        {
          n: "01",
          title: "Discipline",
          text: "Routines, protocols and drills executed the same way at 3 PM and at 3 AM. Consistency is the first wall.",
        },
        {
          n: "02",
          title: "Vigilance",
          text: "We read crowds, rooms and streets before they move. The best intervention is the one that never becomes necessary.",
        },
        {
          n: "03",
          title: "Discretion",
          text: "Gold standard, matte-black manner. You will notice the result of our work, rarely the work itself.",
        },
      ],
    },
    contact: {
      eyebrow: "Get protected",
      title: "Request a confidential consultation.",
      text: "Tell us what keeps you up at night. A senior consultant — never a call center — replies within one business day.",
      name: "Full name",
      email: "Email address",
      phone: "Phone (optional)",
      serviceLabel: "Service of interest",
      servicePlaceholder: "Select a service",
      message: "Tell us about your situation",
      submit: "Send Request",
      sending: "Sending...",
      success: "Request received. We will be in touch shortly.",
      error: "Something went wrong. Please try again.",
      details: [
        { label: "Operations HQ", value: "Prishtina, Kosovo" },
        { label: "Email", value: "ops@vanguard-security.com" },
        { label: "Response line", value: "+383 44 000 000" },
      ],
    },
    quiz: {
      introTitle: "Choose Your Vanguard",
      introText: "Ten questions. Four answers each. At the end, we match you with the exact protection your life demands.",
      introMeta: "Takes less than 2 minutes — fully confidential",
      start: "Begin Assessment",
      questionOf: "of",
      loading: ["Analyzing your profile…", "Assessing threat exposure…", "Matching protection disciplines…", "Selecting your Vanguard…"],
      resultEyebrow: "Your assessment is complete",
      resultTitle: "Your Vanguard is",
      leadTitle: "Where should we send your assessment?",
      leadText: "Leave your details and a senior consultant will reach out with a tailored plan.",
      name: "Full name",
      email: "Email address",
      phone: "Phone (optional)",
      submit: "Send My Assessment",
      sending: "Sending...",
      sent: "Assessment sent. Check your inbox soon.",
      error: "Could not send. You can still contact us directly.",
      contact: "Contact Us",
      retake: "Retake assessment",
    },
    footer: {
      tagline: "Private security, held to a higher standard.",
      rights: "© 2026 Vanguard Security. All rights reserved.",
      location: "Prishtina — operating across the region",
    },
  },
  sq: {
    nav: { services: "Shërbimet", about: "Rreth Nesh", contact: "Kontakt", cta: "Zgjidh Vanguard-in Tënd" },
    hero: {
      eyebrow: "Siguri Private — për ata që presin më shumë",
      line1: "Siguri absolute.",
      line2: "Zero kompromis.",
      sub: "Mbrojtje fizike, mbrojtje e afërt, siguri eventesh, vëzhgim dhe intervenim i shpejtë — e ndërtuar rreth jetës që ju refuzoni ta rrezikoni.",
      ctaPrimary: "Zgjidh Vanguard-in Tënd",
      ctaSecondary: "Zbulo Shërbimet",
      stats: [
        { value: "500+", label: "Operacione të siguruara" },
        { value: "24/7", label: "Gatishmëri reagimi" },
        { value: "15+", label: "Vite përvojë në terren" },
      ],
    },
    marquee: ["SIGURI FIZIKE", "MBROJTJE E AFËRT", "SIGURI EVENTESH", "VËZGJIM", "INTERVENIM I SHPEJTË"],
    services: {
      eyebrow: "Çfarë bëjmë",
      title: "Pesë disiplina. Një standard.",
      note: "Çdo angazhim ndërtohet nga zeroja — pa shabllone, pa shkurtesa.",
    },
    about: {
      eyebrow: "Manifesti Vanguard",
      title: "Ne jemi vija ndërmjet rendit dhe kaosit.",
      intro: "Vanguard Security u themelua mbi një bindje të thjeshtë: mbrojtja nuk është produkt që blihet, është standard që jetobet. Oficerët tanë vijnë nga ushtria, zbatimi i ligjit dhe eventet elitare — të përzgjedhur, të verifikuar dhe të stërvitur sipas një mase të vetme.",
      chapters: [
        {
          n: "01",
          title: "Disiplina",
          text: "Rutina, protokolle e stërvitje të ekzekutuara njëlloj në orën 15:00 dhe në 03:00 të natës. Qëndrueshmëria është muri i parë.",
        },
        {
          n: "02",
          title: "Vigjilenca",
          text: "Ne i lexojmë turmat, ambientet dhe rrugët para se të lëvizin. Intervenimi më i mirë është ai që s'ka nevojë të ndodhë kurrë.",
        },
        {
          n: "03",
          title: "Diskrecioni",
          text: "Standard ari, sjellje e zezë mate. Ju do ta vini re rezultatin e punës sonë, rrallë vetë punën.",
        },
      ],
    },
    contact: {
      eyebrow: "Mbrohuni tani",
      title: "Kërkoni konsultë konfidenciale.",
      text: "Na tregoni çfarë nuk ju lenë të flini natën. Një konsulent i lartë — kurrë call center — ju përgjigjet brenda një dite pune.",
      name: "Emri i plotë",
      email: "Adresa e emailit",
      phone: "Telefoni (opsionale)",
      serviceLabel: "Shërbimi i interesit",
      servicePlaceholder: "Zgjidhni një shërbim",
      message: "Na përshkruani situatën tuaj",
      submit: "Dërgo Kërkesën",
      sending: "Duke dërguar...",
      success: "Kërkesa u pranua. Do t'ju kontaktojmë së shpejti.",
      error: "Diçka shkoi keq. Ju lutem provoni sërish.",
      details: [
        { label: "Qendra e Operacioneve", value: "Prishtinë, Kosovë" },
        { label: "Email", value: "ops@vanguard-security.com" },
        { label: "Linja e kontaktit", value: "+383 44 000 000" },
      ],
    },
    quiz: {
      introTitle: "Zgjidh Vanguard-in Tënd",
      introText: "Dhjetë pyetje. Nga katër përgjigje secila. Në fund, ju përputhim me mbrojtjen që jeta juaj kërkon.",
      introMeta: "Zgjat më pak se 2 minuta — plotësisht konfidenciale",
      start: "Fillo Vlerësimin",
      questionOf: "nga",
      loading: ["Duke analizuar profilin tuaj…", "Duke vlerësuar ekspozimin ndaj rrezikut…", "Duke përputhur disiplinat e mbrojtjes…", "Duke zgjedhur Vanguard-in tuaj…"],
      resultEyebrow: "Vlerësimi juaj përfundoi",
      resultTitle: "Vanguard-i juaj është",
      leadTitle: "Ku ta dërgojmë vlerësimin tuaj?",
      leadText: "Lini të dhënat tuaja dhe një konsulent i lartë do t'ju kontaktojë me një plan të personalizuar.",
      name: "Emri i plotë",
      email: "Adresa e emailit",
      phone: "Telefoni (opsionale)",
      submit: "Dërgo Vlerësimin Tim",
      sending: "Duke dërguar...",
      sent: "Vlerësimi u dërgua. Kontrolloni email-in së shpejti.",
      error: "Dërgimi dështoi. Mund të na kontaktoni drejtpërdrejt.",
      contact: "Kontakto Na",
      retake: "Rifillo vlerësimin",
    },
    footer: {
      tagline: "Siguri private, e mbajtur sipas një standardi më të lartë.",
      rights: "© 2026 Vanguard Security. Të gjitha të drejtat e rezervuara.",
      location: "Prishtinë — duke operuar në gjithë rajonin",
    },
  },
};
