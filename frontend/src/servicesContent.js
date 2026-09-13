export const SERVICE_IMAGES = {
  event:
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=75&w=1600",
  close_protection:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1400",
  physical:
    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1400",
  surveillance:
    "https://images.unsplash.com/photo-1776639257282-35eda08588bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwyfHxzZWN1cml0eSUyMGNhbWVyYSUyMGRhcmslMjBtb2Rlcm58ZW58MHx8fHwxNzg5MzA2NDM2fDA&ixlib=rb-4.1.0&q=75&w=1200",
  patrol:
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&q=80&w=1400",
};

export const BENEFITS = {
  event: {
    en: [
      "Full crowd-flow and access-control planning",
      "Stewards trained for football, boxing, basketball and handball",
      "Concert and private business event coverage",
      "Rapid-response teams positioned across the venue",
      "Coordination with police and medical services",
      "Post-event incident report",
    ],
    sq: [
      "Planifikim i plotë i rrjedhës së turmës dhe hyrjeve",
      "Stewards të trajnuar për futboll, boks, basketboll e hendboll",
      "Mbulim për koncerte dhe evente private biznesi",
      "Ekipe reagimi të shpejtë në çdo pikë të hapësirës",
      "Koordinim me policinë dhe shërbimet mjekësore",
      "Raport incidentesh pas eventit",
    ],
  },
  close_protection: {
    en: [
      "Officers with military and police backgrounds",
      "Discreet protection at home, work and travel",
      "Advance route and venue reconnaissance",
      "Secure transport coordination",
      "Family and residence coverage on request",
    ],
    sq: [
      "Oficerë me përvojë ushtarake dhe policore",
      "Mbrojtje diskrete në shtëpi, punë dhe udhëtime",
      "Verifikim paraprak i rrugëve dhe lokacioneve",
      "Koordinim i transportit të sigurt",
      "Mbulim i familjes dhe rezidencës sipas kërkesës",
    ],
  },
  physical: {
    en: [
      "Uniformed officers at every access point",
      "24/7 static guarding of your facility",
      "Visitor, vehicle and delivery control",
      "Shift reports and incident logging",
      "Visible deterrence that stops incidents before they start",
    ],
    sq: [
      "Oficerë të uniformuar në çdo pikë hyrjeje",
      "Rojë statike 24/7 për objektin tuaj",
      "Kontroll i vizitorëve, automjeteve dhe dërgesave",
      "Raporte ndërrimesh dhe regjistrim incidentesh",
      "Parandalim i dukshëm që ndalon incidentet para se të fillojnë",
    ],
  },
  surveillance: {
    en: [
      "HD camera network designed for your site",
      "Smart alarms with instant notifications",
      "24/7 professional monitoring",
      "Live access from your phone, anywhere",
      "Regular maintenance and system health checks",
    ],
    sq: [
      "Rrjet kamerash HD i projektuar për objektin tuaj",
      "Alarme të mençura me njoftime të menjëhershme",
      "Monitorim profesional 24/7",
      "Qasje live nga telefoni juaj, kudo",
      "Mirëmbajtje e rregullt dhe kontrolle sistemi",
    ],
  },
  patrol: {
    en: [
      "Mobile units on unpredictable routes",
      "Intervention within minutes of an alarm",
      "Multiple sites covered under one contract",
      "Verified check-ins with photo reports",
      "Lower cost than full-time static guarding",
    ],
    sq: [
      "Njësi mobile me rrugë të paparashikueshme",
      "Intervenim brenda minutave pas alarmit",
      "Disa lokacione të mbuluara me një kontratë",
      "Kontrolle të verifikuara me raporte fotografike",
      "Kosto më e ulët se rojja statike me kohë të plotë",
    ],
  },
};

export const SERVICE_PAGE = {
  en: {
    back: "Back to Home",
    benefitsTitle: "What you get",
    bookingTitle: "Rezervo",
    bookingText:
      "Ready when you are. Leave your details and a senior consultant calls you back with a tailored plan for this exact service.",
    formTitle: "Reserve this service",
    formText: "Confidential — we reply within one business day.",
    cta: "Book This Service",
  },
  sq: {
    back: "Kthehu në Faqe",
    benefitsTitle: "Çfarë përfitoni",
    bookingTitle: "Rezervo",
    bookingText:
      "Gati kur të jeni ju. Lini të dhënat tuaja dhe një konsulent i lartë ju telefonon me një plan të personalizuar pikërisht për këtë shërbim.",
    formTitle: "Rezervoni këtë shërbim",
    formText: "Konfidenciale — përgjigjemi brenda një dite pune.",
    cta: "Rezervo Këtë Shërbim",
  },
};

export const EVENT_META = {
  typesTitle: { en: "Choose your arena", sq: "Zgjidh arenën tënde" },
  backEvents: { en: "Back to Event Security", sq: "Kthehu te Siguria e Eventeve" },
};

export const EVENT_TYPES = [
  {
    id: "football",
    name: { en: "Football Matches", sq: "Ndeshje Futbolli" },
    desc: {
      en: "From local derbies to packed international fixtures — full stadium operations with zero tolerance for chaos.",
      sq: "Nga derbit lokale te ndeshjet ndërkombëtare me stadium plot — operacione të plota stadiumi, zero tolerancë ndaj kaosit.",
    },
    bullets: {
      en: ["Turnstile and gate management", "Crowd segregation and ultras control", "Pitch and player tunnel protection", "VIP and match officials escort", "Emergency evacuation readiness"],
      sq: ["Menaxhim i turniketeve dhe hyrjeve", "Ndarje e turmës dhe kontroll i tifogrupove", "Mbrojtje e fushës dhe tunelit të lojtarëve", "Shoqërim i VIP-ve dhe zyrtarëve të ndeshjes", "Gatishmëri për evakuim emergjent"],
    },
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=75&w=1400",
  },
  {
    id: "boxing",
    name: { en: "Boxing Nights", sq: "Netë Boksi" },
    desc: {
      en: "Ring-side intensity needs calm control — fighter entourages, VIP ringside and roaring crowds, all held in balance.",
      sq: "Intensiteti pranë ringut kërkon kontroll të qetë — enturazhet e boksierëve, VIP-at dhe turma e ngarkuar, të gjitha në ekuilibër.",
    },
    bullets: {
      en: ["Ring and red-zone protection", "Fighter and entourage escort", "Ringside VIP area control", "Crowd surge management", "Backstage and locker room security"],
      sq: ["Mbrojtje e ringut dhe zonës së kuqe", "Shoqërim i boksierëve dhe enturazhit", "Kontroll i zonës VIP pranë ringut", "Menaxhim i shtytjeve të turmës", "Siguri e backstage-it dhe dhomave të zhveshjes"],
    },
    image: "https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&q=75&w=1400",
  },
  {
    id: "concert",
    name: { en: "Concerts", sq: "Koncerte" },
    desc: {
      en: "Thousands of fans, one stage, zero incidents — barrier crews, backstage control and artist protection.",
      sq: "Mijëra fansa, një skenë, zero incidente — ekipe barrierash, kontroll backstage-i dhe mbrojtje e artistit.",
    },
    bullets: {
      en: ["Front-stage barrier crews", "Moshpit and crowd-flow control", "Artist and backstage protection", "Ticket and entry scanning", "Medical and evacuation coordination"],
      sq: ["Ekipe barrierash para skenës", "Kontroll i turmës dhe rrjedhës", "Mbrojtje e artistit dhe backstage-it", "Skanim biletash dhe hyrje", "Koordinim mjekësor dhe evakuimi"],
    },
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=75&w=1400",
  },
  {
    id: "business",
    name: { en: "Business Events", sq: "Evente Biznesi" },
    desc: {
      en: "Conferences, galas and product launches — discreet, polished security that matches your brand's standard.",
      sq: "Konferenca, gala dhe lançime produktesh — siguri diskrete dhe e përpunuar që përkon me standardin e markës suaj.",
    },
    bullets: {
      en: ["Guest list and accreditation control", "Discreet plain-clothes officers", "VIP and speaker escort", "Asset and equipment protection", "After-hours venue lockdown"],
      sq: ["Kontroll i listës së të ftuarve dhe akreditimeve", "Oficerë diskretë me veshje civile", "Shoqërim i VIP-ve dhe folësve", "Mbrojtje e pajisjeve dhe pasurive", "Mbyllje e sigurt e ambientit pas eventit"],
    },
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=75&w=1400",
  },
];
