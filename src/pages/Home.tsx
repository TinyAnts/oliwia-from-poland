import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import {
  Instagram,
  Youtube,
  Facebook,
  MessageCircle,
  CheckCircle2,
  GraduationCap,
  Star,
  UserCheck,
  Plane,
  Briefcase,
  MousePointer2,
  Calendar,
  ArrowUpRight,
  ArrowUp,
  Sparkles,
  Heart,
  Menu,
  X,
  Video,
  Camera,
  Megaphone,
  Handshake
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import oliwiaPhoto from "@/assets/images/oliwia-hero.webp";
import oliwiaAboutPhoto from "@/assets/images/oliwia-about.webp";

const BOOKING_URL = "https://oliwiaqn42.setmore.com";
const PAYPAL_URL = "https://paypal.me/OliwiaFromPoland";

const SOCIALS = {
  instagram: "https://www.instagram.com/oliwia_from_poland/",
  facebook: "https://www.facebook.com/profile.php?id=61586639252321",
  youtube: "https://www.youtube.com/@OliwiafromPoland",
  tiktok: "https://www.tiktok.com/@oliwia.from.poland",
};

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 0h1.98c.144 2.58 1.53 4.26 3.9 4.29v2.52c-1.464 0-2.73-.42-3.9-1.26v5.82a5.52 5.52 0 0 1-5.52 5.52A5.52 5.52 0 0 1 0 11.37a5.52 5.52 0 0 1 5.04-5.46v2.58a3 3 0 0 0-.54 5.82A3 3 0 0 0 7.5 11.4V0H9z" transform="translate(4 1)" />
  </svg>
);

/* Count-up number that animates when scrolled into view */
function Counter({ to, suffix = "", duration = 1.6 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf: number;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return <span ref={ref}>{value}{suffix}</span>;
}

/* Rotating circular text badge */
function CircleBadge() {
  return (
    <div className="absolute -bottom-8 -left-8 md:-left-12 w-28 h-28 md:w-36 md:h-36 z-20 animate-spin-slow" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        <defs>
          <path id="circlePath" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <circle cx="50" cy="50" r="46" className="fill-primary" />
        <circle cx="50" cy="50" r="24" className="fill-background" />
        <text className="fill-white uppercase" style={{ fontSize: "8.2px", letterSpacing: "1.6px", fontFamily: "Inter, sans-serif", fontWeight: 600 }}>
          <textPath href="#circlePath">study • visa • life in poland • oliwia •</textPath>
        </text>
        <g transform="translate(50,50)">
          <path d="M0,-7 L1.8,-1.8 L7,0 L1.8,1.8 L0,7 L-1.8,1.8 L-7,0 L-1.8,-1.8 Z" className="fill-primary" />
        </g>
      </svg>
    </div>
  );
}

/* Floating back-to-top button */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <motion.button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16, pointerEvents: visible ? "auto" : "none" }}
      transition={{ duration: 0.25 }}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center hover:bg-primary/90 hover:-translate-y-1 transition-all"
      data-testid="button-back-to-top"
    >
      <ArrowUp size={20} />
    </motion.button>
  );
}

/* Scrolling marquee band */
function Marquee() {
  const items = ["Study in Poland", "Visa Guidance", "Life in Europe", "Polish Lessons", "Content Creation", "1:1 Consultations"];
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden bg-foreground py-4 -rotate-1 scale-105" aria-hidden="true">
      <div className="flex whitespace-nowrap animate-marquee w-max">
        {[...row, ...row].map((item, i) => (
          <span key={i} className="flex items-center text-background/90 font-heading text-lg md:text-xl mx-6">
            <Sparkles size={16} className="text-primary mr-6 shrink-0" />
            <span className={i % 2 ? "font-display-italic text-primary" : ""}>{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const services = [
    { icon: MessageCircle, title: "Polish Lessons for Foreigners", desc: "Basic-level Polish language lessons. Learn everyday phrases, pronunciation, and cultural context for daily life and communication, rather than just academic study.", promo: true, promoPrices: [{ dur: "30 min", old: "€20", now: "€16.99" }, { dur: "50 min", old: "€35", now: "€19.99" }], price: "30 min – €16.99 | 50 min – €19.99" },
    { icon: CheckCircle2, title: "How to Get Married in Europe", desc: "Informational consultation for international couples exploring marriage in Europe (e.g., Denmark, Poland). We discuss procedures, timelines, and practical considerations — helping you understand your options and next steps.", price: "25 min – €45 | 50 min – €80" },
    { icon: GraduationCap, title: "Apply to Polish/European Universities", desc: "Advisory consultation for students exploring university options in Poland and Europe — including program selection, application requirements, timelines, and strategic preparation tips based on real experience.", price: "25 min – €45 | 50 min – €80" },
    { icon: Star, title: "Social Media Strategy Consultation", desc: "Personalized advisory session focused on content positioning, growth strategy, and audience building — based on my experience growing an international audience of 40,000+ followers across four platforms.", price: "25 min – €40 | 50 min – €70" },
    { icon: GraduationCap, title: "Study in Poland Advice", desc: "Advisory session for international students considering Poland — covering student life, cost of living, accommodation realities, and understanding the practical aspects of studying and integrating locally.", price: "25 min – €45 | 50 min – €80" },
    { icon: Plane, title: "Poland Visa Process Overview", desc: "Informational consultation explaining different visa categories, general requirements, timelines, and common challenges — helping you understand the process and prepare independently.", price: "25 min – €45 | 50 min – €80" },
    { icon: Briefcase, title: "Job in Poland Advice", desc: "Tips on finding a job in Poland as a foreigner — job portals, CV tips, work permits, and what employers expect.", price: "25 min – €40 | 50 min – €70" },
    { icon: MousePointer2, title: "UX/UI Advice for Beginners", desc: "Introductory advice on getting started in UX/UI design — tools, portfolio tips, learning resources, and career paths.", price: "25 min – €40 | 50 min – €70" },
    { icon: MessageCircle, title: "Ask Me Anything", desc: "A casual, open session where you can ask me anything about life in Poland, my journey, content creation, or anything else on your mind.", price: "25 min – €30" },
  ];

  const cardTints = [
    { tile: "from-rose-400 to-amber-300", bar: "from-rose-400 via-primary to-amber-300", wash: "from-rose-50" },
    { tile: "from-amber-400 to-orange-300", bar: "from-amber-400 via-orange-400 to-rose-300", wash: "from-amber-50" },
    { tile: "from-orange-400 to-rose-300", bar: "from-orange-400 via-rose-400 to-primary", wash: "from-orange-50" },
  ];

  const socialButtons = [
    { href: SOCIALS.instagram, label: "Instagram", icon: <Instagram size={18} />, hover: "hover:border-[#E1306C] hover:text-[#E1306C]" },
    { href: SOCIALS.facebook, label: "Facebook", icon: <Facebook size={18} />, hover: "hover:border-[#1877F2] hover:text-[#1877F2]" },
    { href: SOCIALS.youtube, label: "YouTube", icon: <Youtube size={18} />, hover: "hover:border-[#FF0000] hover:text-[#FF0000]" },
    { href: SOCIALS.tiktok, label: "TikTok", icon: <TikTokIcon className="w-4 h-4" />, hover: "hover:border-black hover:text-black" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-rose-400 to-amber-400 origin-left z-[60]"
        style={{ scaleX: progress }}
      />

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="font-heading font-semibold text-xl tracking-tight cursor-pointer" onClick={() => scrollTo('hero')}>
            Oliwia <span className="text-primary font-display-italic">from Poland</span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollTo('about')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-about">About</button>
            <button onClick={() => scrollTo('services')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-services">Services</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-how">How It Works</button>
            <button onClick={() => scrollTo('for-brands')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-brands">For Brands</button>
            <button onClick={() => scrollTo('faq')} className="text-sm font-medium hover:text-primary transition-colors" data-testid="link-nav-faq">FAQ</button>
            <Button onClick={() => scrollTo('services')} className="rounded-full px-6 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20" data-testid="button-nav-book">
              Book Now
            </Button>
          </div>

          <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} data-testid="button-mobile-menu">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 flex flex-col space-y-6 md:hidden">
          <button onClick={() => scrollTo('about')} className="text-xl font-medium text-left" data-testid="link-mobile-about">About</button>
          <button onClick={() => scrollTo('services')} className="text-xl font-medium text-left" data-testid="link-mobile-services">Services</button>
          <button onClick={() => scrollTo('how-it-works')} className="text-xl font-medium text-left" data-testid="link-mobile-how">How It Works</button>
          <button onClick={() => scrollTo('for-brands')} className="text-xl font-medium text-left" data-testid="link-mobile-brands">For Brands</button>
          <button onClick={() => scrollTo('faq')} className="text-xl font-medium text-left" data-testid="link-mobile-faq">FAQ</button>
          <Button onClick={() => scrollTo('services')} className="rounded-full w-full py-6 text-lg mt-4 bg-primary text-white" data-testid="button-mobile-book">
            Book a Consultation
          </Button>
        </div>
      )}

      {/* 1. Hero */}
      <section id="hero" className="pt-32 pb-24 md:pt-44 md:pb-32 bg-hero-gradient relative overflow-hidden">
        {/* Drifting color blobs */}
        <div className="absolute top-10 right-[10%] w-96 h-96 rounded-full bg-rose-300/30 blur-3xl animate-blob" aria-hidden="true"></div>
        <div className="absolute bottom-0 left-[5%] w-80 h-80 rounded-full bg-amber-200/40 blur-3xl animate-blob-slow" aria-hidden="true"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-14 lg:gap-24">
            <motion.div
              className="w-full md:w-[55%] flex flex-col items-start text-left"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 border border-primary/20 text-primary font-medium text-sm mb-8 shadow-sm backdrop-blur"
              >
                <Heart size={14} className="fill-primary text-primary" />
                Creator • Consultant • Your guide to Poland
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-[5.2rem] font-semibold leading-[1.02] mb-8 tracking-tight">
                Your journey to{" "}
                <span className="font-display-italic text-gradient">Poland</span>
                <br />
                starts <span className="relative inline-block">
                  here
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 120 12" fill="none" aria-hidden="true">
                    <path d="M3 9 C 30 3, 90 3, 117 8" stroke="hsl(10 78% 58%)" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-lg leading-relaxed">
                From university admissions to visas to building a whole new life — I've helped thousands navigate it. Let's plan yours together.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button
                  size="lg"
                  onClick={() => scrollTo('services')}
                  className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 group"
                  data-testid="button-hero-book"
                >
                  Book a Consultation
                  <ArrowUpRight className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" size={20} />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollTo('about')}
                  className="rounded-full px-8 py-6 text-lg bg-white/50 border-primary/20 hover:bg-white/80"
                  data-testid="button-hero-about"
                >
                  Meet Oliwia
                </Button>
              </div>

              {/* Trust line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex items-center gap-3 text-sm text-muted-foreground"
                data-testid="text-hero-trust"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Instagram size={16} />
                  <Facebook size={16} />
                  <TikTokIcon className="w-4 h-4" />
                  <Youtube size={16} />
                </div>
                <span>
                  A community of <strong className="text-foreground">40,000+ followers</strong> · millions of views across 4 platforms
                </span>
              </motion.div>
            </motion.div>

            {/* Hero photo — editorial arch */}
            <motion.div
              className="w-full md:w-[45%] relative"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="relative w-full max-w-sm mx-auto">
                {/* Glow behind arch */}
                <div className="absolute inset-4 rounded-t-full rounded-b-[2rem] bg-gradient-to-b from-rose-300/50 to-amber-200/50 blur-2xl" aria-hidden="true"></div>

                {/* Arch-shaped portrait */}
                <div className="relative aspect-[4/5] rounded-t-full rounded-b-[2rem] overflow-hidden shadow-2xl border-[6px] border-white/80">
                  <img
                    src={oliwiaPhoto}
                    alt="Oliwia from Poland"
                    className="w-full h-full object-cover object-top"
                    data-testid="img-hero"
                  />
                </div>

                {/* Floating platform chips */}
                <div className="absolute -left-4 top-24 md:-left-12 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 animate-float-delayed z-20">
                  <span className="w-8 h-8 rounded-full bg-[#1877F2] flex items-center justify-center text-white"><Facebook size={16} /></span>
                  <div className="text-xs font-semibold leading-tight">Oliwia from Poland<div className="text-muted-foreground font-normal">Facebook</div></div>
                </div>
                <div className="absolute -right-4 top-10 md:-right-10 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 animate-float z-20">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500 flex items-center justify-center text-white"><Instagram size={16} /></span>
                  <div className="text-xs font-semibold leading-tight">@oliwia_from_poland<div className="text-muted-foreground font-normal">Instagram</div></div>
                </div>
                <div className="absolute -right-2 bottom-24 md:-right-8 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 animate-float-delayed z-20">
                  <span className="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white"><Youtube size={16} /></span>
                  <div className="text-xs font-semibold leading-tight">Oliwia from Poland<div className="text-muted-foreground font-normal">YouTube</div></div>
                </div>

                <CircleBadge />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Marquee band */}
      <Marquee />

      {/* 2. About + socials + stats */}
      <section id="about" className="py-28 bg-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-secondary/40 blur-3xl" aria-hidden="true"></div>
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div
              className="w-full md:w-2/5 relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute -top-5 -left-3 z-20 rotate-[-6deg] bg-primary text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                Hi, that's me! 👋
              </div>
              <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-xl relative group">
                <img
                  src={oliwiaAboutPhoto}
                  alt="Oliwia"
                  className="w-full h-full object-cover object-[center_20%] scale-125 transition-transform duration-700 group-hover:scale-[1.35]"
                  data-testid="img-about"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" aria-hidden="true"></div>
              </div>
            </motion.div>

            <motion.div
              className="w-full md:w-3/5"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-sans">About Me</h2>
              <h3 className="text-4xl md:text-5xl font-semibold mb-6">
                Creator, consultant &<br /><span className="font-display-italic text-gradient">your friend in Poland</span>
              </h3>
              <p className="text-lg text-muted-foreground mb-5 leading-relaxed">
                I'm Oliwia — a Poland-based creator sharing real-life insights about studying, living, and navigating life in Europe with a growing international community across Instagram, Facebook, TikTok and YouTube.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                If you're planning to move to Poland — for university, love, or a fresh start — I offer 1:1 advisory consultations where I guide you through your options, explain processes, and help you plan your next steps confidently.
              </p>

              {/* Animated stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="bg-secondary/30 p-5 rounded-3xl border border-secondary/50 text-center" data-testid="card-stat-0">
                  <div className="font-semibold text-3xl text-foreground mb-1 font-heading"><Counter to={40} suffix="k+" /></div>
                  <div className="text-xs text-muted-foreground leading-tight">Followers across all platforms</div>
                </div>
                <div className="bg-accent/50 p-5 rounded-3xl border border-accent text-center" data-testid="card-stat-1">
                  <div className="font-semibold text-3xl text-foreground mb-1 font-heading font-display-italic">Millions</div>
                  <div className="text-xs text-muted-foreground leading-tight">of views worldwide</div>
                </div>
                <div className="bg-secondary/30 p-5 rounded-3xl border border-secondary/50 text-center" data-testid="card-stat-2">
                  <div className="font-semibold text-3xl text-foreground mb-1 font-heading"><Counter to={4} /></div>
                  <div className="text-xs text-muted-foreground leading-tight">Platforms</div>
                </div>
                <div className="bg-accent/50 p-5 rounded-3xl border border-accent text-center" data-testid="card-stat-3">
                  <div className="font-semibold text-3xl text-foreground mb-1 font-heading"><Counter to={9} /></div>
                  <div className="text-xs text-muted-foreground leading-tight">Consultation topics</div>
                </div>
              </div>

              {/* Social buttons */}
              <div className="flex flex-wrap gap-4">
                {socialButtons.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-5 py-3 rounded-full bg-[#FAFAFA] border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all font-medium text-sm ${s.hover}`}
                    data-testid={`link-social-${s.label.toLowerCase()}`}
                  >
                    {s.icon} {s.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Services */}
      <section id="services" className="py-28 bg-background relative overflow-hidden">
        {/* Drifting blobs, hero-style */}
        <div className="absolute top-24 -left-24 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl animate-blob" aria-hidden="true"></div>
        <div className="absolute bottom-24 -right-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl animate-blob-slow" aria-hidden="true"></div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-sans">1:1 Sessions</h2>
            <h3 className="text-4xl md:text-6xl font-semibold mb-5">
              Book a consultation<br />
              <span className="relative inline-block">
                <span className="font-display-italic text-gradient">with me</span>
                <svg className="absolute -bottom-3 left-0 w-full" viewBox="0 0 120 12" fill="none" aria-hidden="true">
                  <path d="M3 9 C 30 3, 90 3, 117 8" stroke="hsl(10 78% 58%)" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>
            </h3>
            <p className="text-lg text-muted-foreground mt-6">
              All sessions are held in the evening CET timezone. Choose the topic that fits your needs and book directly through the form.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const tint = cardTints[index % 3];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 32, rotate: index % 2 ? 0.6 : -0.6 }}
                  whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                  whileHover={{ y: -10, rotate: index % 2 ? -0.4 : 0.4 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 200, damping: 22, delay: (index % 3) * 0.08 }}
                  className="h-full"
                >
                  <Card className={`h-full flex flex-col hover:shadow-2xl transition-all duration-300 backdrop-blur overflow-hidden group rounded-[2rem] relative ${(service as any).promo ? "border-2 border-primary/50 ring-4 ring-primary/15 bg-gradient-to-b from-rose-50/95 to-amber-50/90 shadow-2xl shadow-primary/25 lg:scale-[1.04] lg:hover:scale-[1.06] z-10" : "hover:border-primary/30 border-white/60 bg-white/85 shadow-sm"}`}>
                    {/* Animated gradient top bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${tint.bar} ${(service as any).promo ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"} origin-left transition-transform duration-500`} aria-hidden="true"></div>

                    <CardContent className="p-8 flex flex-col h-full relative">
                      <div className={`absolute inset-0 bg-gradient-to-br ${tint.wash} to-transparent opacity-0 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none`}></div>

                      <span className="absolute top-6 right-7 font-heading font-display-italic text-5xl text-primary/10 group-hover:text-primary/30 group-hover:-rotate-6 transition-all duration-300 select-none" aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {(service as any).promo && (
                        <div className="absolute -top-0.5 left-7 rotate-[-3deg] bg-primary text-white text-[11px] font-bold px-3 py-1.5 rounded-b-xl shadow-md flex items-center gap-1">
                          <Sparkles size={11} className="text-amber-200" /> PROMO
                        </div>
                      )}

                      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${tint.tile} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300`}>
                        <service.icon size={26} strokeWidth={1.5} />
                        <span className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-primary" aria-hidden="true">
                          <Sparkles size={14} />
                        </span>
                      </div>

                      <h4 className="text-xl font-semibold mb-3 font-heading leading-tight pr-8 relative">{service.title}</h4>
                      <p className="text-muted-foreground mb-6 flex-grow leading-relaxed text-sm relative">
                        {service.desc}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 gap-4 relative">
                        <span className="font-semibold text-sm leading-tight max-w-[60%]">
                          {(service as any).promoPrices ? (
                            <span className="flex flex-col gap-1">
                              {(service as any).promoPrices.map((p: { dur: string; old: string; now: string }) => (
                                <span key={p.dur} className="font-normal">
                                  {p.dur} – <s className="text-muted-foreground/60">{p.old}</s>{" "}
                                  <strong className="text-primary font-bold">{p.now}</strong>
                                </span>
                              ))}
                            </span>
                          ) : (
                            <>Price: <span className="text-muted-foreground font-normal whitespace-pre-line">{service.price}</span></>
                          )}
                        </span>
                        <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" className="inline-flex">
                          <Button className="rounded-full bg-foreground text-background hover:bg-primary transition-all h-10 pl-5 pr-4 text-sm group/btn" data-testid={`button-book-service-${index}`}>
                            Book Now
                            <ArrowUpRight size={15} className="ml-0.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                          </Button>
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How it works */}
      <section id="how-it-works" className="py-28 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-sans">Simple Process</h2>
            <h3 className="text-4xl md:text-5xl font-semibold">How it <span className="font-display-italic text-gradient">works</span></h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Hand-drawn connector that draws itself as you scroll to it */}
            <svg className="hidden md:block absolute top-6 left-[12%] right-[12%] w-[76%] h-24 z-0" viewBox="0 0 1000 100" fill="none" preserveAspectRatio="none" aria-hidden="true">
              <motion.path
                d="M 10,55 C 150,10 280,95 500,50 S 800,10 990,55"
                stroke="hsl(10 78% 58% / 0.5)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1 14"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
              />
            </svg>

            {[
              { step: "1", title: "Choose Your Topic", desc: "Browse the consultation services above and pick what you need help with.", icon: MousePointer2 },
              { step: "2", title: "Pick a Time Slot", desc: "Click 'Book Now' and choose a date and time that suits you on my booking page. I'm available afternoons and evenings, CET.", icon: Calendar },
              { step: "3", title: "Pay & Meet Online", desc: "Confirm your slot by sending the fee via PayPal (paypal.me/OliwiaFromPoland). I'll then send your Google Meet link and we're set.", icon: MessageCircle }
            ].map((step, index) => (
              <motion.div
                key={index}
                className="relative z-10 flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 180, damping: 18, delay: index * 0.25 }}
              >
                <div className={`w-24 h-24 rounded-full bg-white border-4 border-background flex items-center justify-center mb-6 shadow-xl relative ${index % 2 ? "animate-float-delayed" : "animate-float"}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 to-amber-200/40 rounded-full m-2"></div>
                  <step.icon className="w-8 h-8 text-primary relative z-10" />
                  <motion.div
                    className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm font-heading font-display-italic"
                    initial={{ scale: 0, rotate: -30 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: index * 0.25 + 0.3 }}
                  >
                    {step.step}
                  </motion.div>
                </div>
                <h4 className="text-xl font-semibold mb-3 font-heading">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed px-4">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4b. Media kit — for brands */}
      <section id="for-brands" className="py-28 bg-background relative overflow-hidden">
        <div className="absolute -top-24 right-[15%] w-80 h-80 rounded-full bg-rose-200/40 blur-3xl animate-blob" aria-hidden="true"></div>
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-sans">Media Kit</h2>
            <h3 className="text-4xl md:text-5xl font-semibold">
              Brands, let's create <span className="font-display-italic text-gradient">together</span>
            </h3>
            <p className="text-lg text-muted-foreground mt-5">
              I partner with brands that genuinely help people studying, moving and building a life in Europe.
            </p>
          </div>

          {/* Platform stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Facebook", handle: "Oliwia from Poland", count: 20, suffix: "k+", href: SOCIALS.facebook, icon: <Facebook size={20} />, chip: "bg-[#1877F2]" },
              { label: "Instagram", handle: "@oliwia_from_poland", count: 14, suffix: "k+", href: SOCIALS.instagram, icon: <Instagram size={20} />, chip: "bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500" },
              { label: "YouTube", handle: "Oliwia from Poland", count: 7, suffix: "k+", href: SOCIALS.youtube, icon: <Youtube size={20} />, chip: "bg-[#FF0000]" },
              { label: "TikTok", handle: "@oliwia.from.poland", count: 2, suffix: "k+", href: SOCIALS.tiktok, icon: <TikTokIcon className="w-5 h-5" />, chip: "bg-black" },
            ].map((p, i) => (
              <motion.a
                key={p.label}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.label} — ${p.handle}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.08 }}
                className="group bg-white rounded-3xl border border-border/60 p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-primary/30 transition-all"
                data-testid={`card-mediakit-${p.label.toLowerCase()}`}
              >
                <span className={`inline-flex w-11 h-11 rounded-2xl ${p.chip} text-white items-center justify-center mb-4 shadow-md group-hover:scale-110 group-hover:-rotate-6 transition-transform`}>
                  {p.icon}
                </span>
                <div className="font-heading font-semibold text-3xl"><Counter to={p.count} suffix={p.suffix} /></div>
                <div className="text-xs text-muted-foreground mt-1 leading-tight">{p.handle}</div>
              </motion.a>
            ))}
          </div>

          {/* Audience + formats */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            className="bg-foreground text-background rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/25 blur-3xl" aria-hidden="true"></div>
            <div className="grid md:grid-cols-3 gap-10 relative">
              <div>
                <h4 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Reach</h4>
                <p className="text-background/70 text-sm leading-relaxed">
                  A community of <strong className="text-background">40,000+ followers</strong> across 4 platforms with <strong className="text-background">millions of views</strong> — an international audience of students, couples and young professionals planning their move to Poland and Europe.
                </p>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2"><Camera size={16} className="text-primary" /> Content formats</h4>
                <div className="flex flex-wrap gap-2">
                  {["Reels & short-form", "YouTube videos", "Stories", "Sponsored posts", "UGC for brands"].map(f => (
                    <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium">{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-lg mb-3 flex items-center gap-2"><Handshake size={16} className="text-primary" /> Collaboration types</h4>
                <div className="flex flex-wrap gap-2">
                  {["Sponsored content", "Brand ambassadorship", "Product reviews", "Campaigns for students & expats"].map(f => (
                    <span key={f} className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-medium">{f}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="relative mt-10 flex flex-col sm:flex-row items-center gap-4">
              <a href="mailto:ask.oliwia.from.poland@gmail.com?subject=Collaboration%20inquiry" className="inline-flex">
                <Button
                  className="rounded-full px-8 py-6 bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30 text-base"
                  data-testid="button-mediakit-call"
                >
                  <Megaphone size={18} className="mr-1" /> Contact for collaborations
                </Button>
              </a>
              <a href="mailto:ask.oliwia.from.poland@gmail.com" className="text-background/70 hover:text-white underline underline-offset-4 text-sm transition-colors">
                or email ask.oliwia.from.poland@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4c. Instagram band */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-sans">Instagram</h2>
            <h3 className="text-4xl md:text-5xl font-semibold">
              Follow the <span className="font-display-italic text-gradient">journey</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { type: "img" as const, src: oliwiaPhoto, alt: "Oliwia — life in Poland" },
              { type: "tile" as const, label: "Visa & study tips", icon: GraduationCap, tint: "from-rose-400 to-amber-300" },
              { type: "img" as const, src: oliwiaAboutPhoto, alt: "Oliwia — behind the scenes" },
              { type: "tile" as const, label: "Everyday life in Poland", icon: Heart, tint: "from-amber-400 to-rose-400" },
            ].map((t, i) => (
              <motion.a
                key={i}
                href={SOCIALS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Oliwia's Instagram profile"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.07 }}
                className="group relative aspect-square rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all"
                data-testid={`tile-instagram-${i}`}
              >
                {t.type === "img" ? (
                  <>
                    <img src={t.src} alt={t.alt} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
                  </>
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${t.tint} flex flex-col items-center justify-center text-white p-5 text-center transition-transform duration-500 group-hover:scale-105`}>
                    <t.icon size={30} className="mb-3 opacity-90" />
                    <span className="font-heading font-semibold leading-tight">{t.label}</span>
                  </div>
                )}
                <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-foreground opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true">
                  <Instagram size={15} />
                </span>
              </motion.a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              data-testid="button-instagram-follow"
            >
              <Instagram size={18} /> @oliwia_from_poland
            </a>
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" className="py-28 bg-background relative overflow-hidden">
        <div className="absolute top-32 -right-28 w-80 h-80 rounded-full bg-secondary/50 blur-3xl animate-blob" aria-hidden="true"></div>
        <div className="absolute bottom-10 -left-28 w-72 h-72 rounded-full bg-amber-200/40 blur-3xl animate-blob-slow" aria-hidden="true"></div>

        <div className="container mx-auto px-6 md:px-12 max-w-3xl relative z-10">
          <div className="text-center mb-16 relative">
            <motion.span
              className="absolute -top-8 right-4 md:right-16 text-primary"
              initial={{ scale: 0, rotate: -60 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 260, damping: 14 }}
              aria-hidden="true"
            >
              <Sparkles size={30} />
            </motion.span>
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-sans">Got Questions?</h2>
            <h3 className="text-4xl md:text-5xl font-semibold">Frequently asked <span className="font-display-italic text-gradient">questions</span></h3>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {[
              { q: "How do I book a consultation?", a: "Browse the services above, click 'Book Now' on the topic you need, and pick a free time slot on my booking page. To confirm your session, send the fee via PayPal (paypal.me/OliwiaFromPoland) within 24 hours. Once the payment arrives, I confirm your booking. Unpaid bookings are cancelled." },
              { q: "What timezone are the sessions in?", a: "My availability is afternoons and evenings, Central European Time. The booking page shows the open slots in your own timezone automatically." },
              { q: "How long is each session?", a: "Sessions typically run for 25-50 minutes depending on chosen service." },
              { q: "What platform do we use for the call?", a: "Google Meet. Once your payment is confirmed, I'll send you a calendar invite with the Meet link for your session." },
              { q: "Can I get a refund?", a: "Cancellations made at least 48 hours before the scheduled time are fully refundable. For shorter notice, we can reschedule." },
              { q: "Do you speak Tamil / Hindi?", a: "My husband speaks Tamil so if you want a consultation to be in Tamil you can speak with him instead, otherwise we can have a consultation in English or Polish." },
              { q: "Can I book multiple sessions?", a: "Yes absolutely! If you need ongoing support (like language lessons or comprehensive university application help), we can arrange a package or multiple dates." }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 ? 40 : -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 160, damping: 20, delay: index * 0.05 }}
              >
                <AccordionItem value={`item-${index}`} className="border rounded-3xl px-6 bg-white/70 backdrop-blur overflow-hidden data-[state=open]:bg-white data-[state=open]:shadow-lg data-[state=open]:border-primary/30 hover:border-primary/20 transition-all">
                  <AccordionTrigger className="text-left font-medium text-lg py-5 hover:no-underline hover:text-primary">
                    <span className="flex items-center gap-3">
                      <span className="font-heading font-display-italic text-primary/40 text-base" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      {faq.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5 pt-0 pl-9">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 6. Big CTA banner */}
      <section className="py-20 px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="container mx-auto relative overflow-hidden rounded-[2.5rem] bg-foreground text-background py-16 md:py-20 px-8 md:px-16"
        >
          <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary/30 blur-3xl animate-blob" aria-hidden="true"></div>
          <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-rose-400/20 blur-3xl animate-blob-slow" aria-hidden="true"></div>
          {/* Giant italic watermark */}
          <span className="absolute -bottom-10 left-6 font-heading font-display-italic text-[7rem] md:text-[10rem] text-white/5 whitespace-nowrap select-none leading-none" aria-hidden="true">
            do zobaczenia!
          </span>

          <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-3xl md:text-5xl font-semibold mb-4 leading-tight">
                Ready to start your <span className="font-display-italic text-gradient">Polish chapter?</span>
              </h3>
              <p className="text-background/70 text-lg mb-8 max-w-xl">
                Pick a topic, book your session, and let's plan your move together — one honest conversation at a time.
              </p>
              <Button
                size="lg"
                onClick={() => scrollTo('services')}
                className="rounded-full px-10 py-6 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 group"
                data-testid="button-cta-book"
              >
                Book a Consultation <ArrowUpRight size={20} className="ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>

            {/* Mini arch portrait, echoing the hero */}
            <div className="relative w-44 md:w-56 shrink-0">
              <div className="absolute inset-2 rounded-t-full rounded-b-3xl bg-gradient-to-b from-primary/40 to-amber-300/30 blur-xl" aria-hidden="true"></div>
              <div className="relative aspect-[4/5] rounded-t-full rounded-b-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
                <img src={oliwiaPhoto} alt="Oliwia" className="w-full h-full object-cover object-top" />
              </div>
              <div className="absolute -left-6 bottom-6 bg-white text-foreground rounded-2xl shadow-xl px-3 py-2 flex items-center gap-2 animate-float text-xs font-semibold">
                <Heart size={13} className="fill-primary text-primary" /> See you soon!
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 7. Disclaimer */}
      <section className="py-12 bg-secondary/10 border-t border-border/50">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <h4 className="font-semibold mb-3 text-foreground font-heading">Important Information</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All consultations are advisory and informational in nature. I provide guidance based on personal experience and general knowledge. I do not prepare or submit applications, complete official documents, or provide legal or immigration representation.
            <br className="mb-2" />
            Clients are responsible for independently verifying requirements with official institutions and authorities.
          </p>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="bg-foreground text-background py-16 border-t border-white/10 relative overflow-hidden">
        <span className="absolute -bottom-12 right-0 font-heading font-display-italic text-[9rem] text-white/[0.04] whitespace-nowrap select-none leading-none pointer-events-none" aria-hidden="true">
          Oliwia
        </span>
        <div className="container mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 relative">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="font-heading font-semibold text-2xl tracking-tight">
              Oliwia <span className="text-primary font-display-italic">from Poland</span>
            </div>
            <a href="mailto:ask.oliwia.from.poland@gmail.com" className="text-background/60 hover:text-white transition-colors" data-testid="link-footer-email">
              ask.oliwia.from.poland@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a href={SOCIALS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all" data-testid="link-footer-instagram">
              <Instagram size={18} />
            </a>
            <a href={SOCIALS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all" data-testid="link-footer-facebook">
              <Facebook size={18} />
            </a>
            <a href={SOCIALS.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all" data-testid="link-footer-youtube">
              <Youtube size={18} />
            </a>
            <a href={SOCIALS.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all" data-testid="link-footer-tiktok">
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>

          <div className="flex flex-col items-center md:items-end gap-6">
            <Button
              onClick={() => scrollTo('services')}
              className="rounded-full bg-primary text-white hover:bg-primary/90"
              data-testid="button-footer-book"
            >
              Book a Consultation
            </Button>
            <div className="text-sm text-white/50">
              © {new Date().getFullYear()} Oliwia from Poland. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  );
}
