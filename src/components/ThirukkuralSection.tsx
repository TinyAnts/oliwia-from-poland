import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Coffee, Languages, BookOpen, Heart, Share2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

import coverImg from "@/assets/images/thirukkural-cover.webp";
import pageImg from "@/assets/images/thirukkural-page.webp";

export const KOFI_URL = "https://ko-fi.com/oliwiafrompoland";
export const THIRUKKURAL_PDF = "/downloads/thirukkural-10-couplets-oliwia-from-poland.pdf";
const COUNTER_API = "/api/downloads";
const COUNT_EVENT = "thirukkural-downloads";

const TRANSLATED = 10;
const TOTAL_KURALS = 1330;

/* Tell the server about one download. The PDF link works on its own,
   so if this fails the visitor still gets the file. */
function countDownload() {
  try {
    fetch(COUNTER_API, { method: "POST", keepalive: true })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.count === "number") {
          window.dispatchEvent(new CustomEvent(COUNT_EVENT, { detail: d.count }));
        }
      })
      .catch(() => {});
  } catch {
    /* ignore */
  }
}

/* The faint number in the footer corner. Hidden completely if the counter
   is not set up yet, so visitors never see an error. */
export function DownloadCounter({ className = "" }: { className?: string }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(COUNTER_API, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && typeof d.count === "number") setCount(d.count);
      })
      .catch(() => {});
    const onCount = (e: Event) => setCount((e as CustomEvent<number>).detail);
    window.addEventListener(COUNT_EVENT, onCount);
    return () => {
      alive = false;
      window.removeEventListener(COUNT_EVENT, onCount);
    };
  }, []);

  if (count === null) return null;
  return (
    <span
      className={className}
      title="Thirukkural PDF downloads"
      aria-hidden="true"
      data-testid="text-download-counter"
    >
      {count}
    </span>
  );
}

const inside = [
  {
    icon: Languages,
    title: "The original Tamil",
    text: "Each couplet in Tamil script, with a guide in Latin letters for reading it aloud.",
  },
  {
    icon: BookOpen,
    title: "Polish and English",
    text: "A Polish translation with an easy pronunciation guide, so Tamil speakers can read the Polish too.",
  },
  {
    icon: Heart,
    title: "Words for everyday life",
    text: "I chose verses about speech, friendship, learning and kindness.",
  },
];

export default function ThirukkuralSection() {
  const [thanks, setThanks] = useState(false);

  /* Support links like /thirukkural or /#thirukkural from social media bios. */
  useEffect(() => {
    const { hash, pathname } = window.location;
    if (hash === "#thirukkural" || pathname.replace(/\/$/, "") === "/thirukkural") {
      const t = window.setTimeout(() => {
        document.getElementById("thirukkural")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
      return () => window.clearTimeout(t);
    }
  }, []);

  const onDownload = () => {
    countDownload();
    setThanks(true);
  };

  const progress = Math.max((TRANSLATED / TOTAL_KURALS) * 100, 1.2);

  return (
    <section
      id="thirukkural"
      aria-labelledby="thirukkural-title"
      className="py-28 bg-[#f4ede2] relative overflow-hidden scroll-mt-16"
    >
      {/* Soft background shapes, echoing the booklet colours */}
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl animate-blob-slow" aria-hidden="true"></div>
      <div className="absolute bottom-0 right-[8%] w-80 h-80 rounded-full bg-rose-200/40 blur-3xl animate-blob" aria-hidden="true"></div>
      <span
        className="hidden lg:block absolute top-8 left-10 text-[9rem] leading-none text-[#8a3b30]/[0.06] select-none pointer-events-none"
        aria-hidden="true"
        lang="ta"
      >
        குறள்
      </span>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* Booklet visual */}
          <motion.div
            className="w-full lg:w-[42%] flex justify-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-[230px] sm:w-[280px] md:w-[300px] aspect-[720/1022] mr-10 sm:mr-14">
              <img
                src={pageImg}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 w-full h-full rounded-xl shadow-xl rotate-[7deg] translate-x-14 sm:translate-x-20 translate-y-3 border border-black/5"
              />
              <a
                href={THIRUKKURAL_PDF}
                download
                onClick={onDownload}
                className="absolute inset-0 block rounded-xl shadow-2xl -rotate-[3deg] hover:-rotate-[1deg] hover:-translate-y-1 transition-transform duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40"
                aria-label="Download the free Thirukkural PDF"
                data-testid="link-thirukkural-cover"
              >
                <img
                  src={coverImg}
                  alt="Cover of the booklet: Thirukkural, ten selected couplets in Tamil, Polish and English"
                  loading="lazy"
                  className="w-full h-full rounded-xl border border-black/5"
                />
              </a>

              <div className="absolute -left-6 sm:-left-10 top-10 bg-white rounded-2xl shadow-xl px-4 py-2.5 text-sm font-semibold flex items-center gap-2 animate-float z-20">
                <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true"></span>
                Free PDF
              </div>
              <div className="absolute -right-12 sm:-right-16 bottom-10 bg-foreground text-background rounded-2xl shadow-xl px-4 py-3 text-xs leading-tight animate-float-delayed z-20">
                <span className="block font-heading text-lg font-semibold">13 pages</span>
                Tamil · Polski · English
              </div>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            className="w-full lg:w-[58%]"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h2 className="text-sm font-semibold text-primary uppercase tracking-[0.2em] mb-3 font-sans">
              Free PDF · A little project
            </h2>
            <h3 id="thirukkural-title" className="text-4xl md:text-5xl font-semibold mb-6 leading-[1.08]">
              Thirukkural, <span className="font-display-italic text-gradient">now in Polish</span>
            </h3>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
              People often ask under my Thirukkural videos whether these verses exist in Polish. So I made a small
              booklet: ten couplets in the original Tamil, translated into Polish and English, with a guide for reading
              each one aloud. It's free for anyone to download.
            </p>

            <ul className="grid sm:grid-cols-3 gap-4 mb-10">
              {inside.map((item) => (
                <li key={item.title} className="bg-white/70 backdrop-blur rounded-3xl p-5 border border-white shadow-sm">
                  <span className="inline-flex w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-400 to-amber-300 text-white items-center justify-center mb-3 shadow-md">
                    <item.icon size={18} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="block font-heading font-semibold leading-tight mb-1.5">{item.title}</span>
                  <span className="block text-sm text-muted-foreground leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-lg bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 [&_svg]:size-5"
              >
                <a href={THIRUKKURAL_PDF} download onClick={onDownload} data-testid="button-thirukkural-download">
                  <Download aria-hidden="true" /> Download the free PDF
                </a>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7 py-6 text-lg bg-white/60 border-primary/25 hover:bg-white [&_svg]:size-5"
              >
                <a href={KOFI_URL} target="_blank" rel="noopener noreferrer" data-testid="button-thirukkural-kofi">
                  <Coffee aria-hidden="true" /> Buy me a coffee
                  <span className="sr-only"> on Ko-fi (opens in a new tab)</span>
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">PDF · 13 pages · 0.5 MB · no sign-up, no email needed</p>

            <div aria-live="polite" className="min-h-[1.5rem]">
              {thanks && (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 inline-flex items-start gap-2 text-sm bg-white rounded-2xl px-4 py-3 shadow-sm border border-emerald-200"
                  data-testid="text-thirukkural-thanks"
                >
                  <Check size={16} className="text-emerald-600 mt-0.5 shrink-0" aria-hidden="true" />
                  <span>
                    Thank you! Your download should start now. If you enjoy it, sharing it with a friend helps me a lot.
                  </span>
                </motion.p>
              )}
            </div>
          </motion.div>
        </div>

        {/* The project: should I keep going? */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mt-20 bg-foreground text-background rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary/25 blur-3xl" aria-hidden="true"></div>
          <div className="grid md:grid-cols-[1.25fr_1fr] gap-10 md:gap-14 relative items-center">
            <div>
              <h4 className="font-heading font-semibold text-3xl md:text-4xl mb-4 leading-tight">
                Should I keep going? <span className="font-display-italic text-gradient">You decide.</span>
              </h4>
              <p className="text-background/75 leading-relaxed mb-4">
                This booklet is a small test. I want to find out if you would like more of it. If people download and
                share it, I'll keep translating, and one day I would love to turn it into a real book.
              </p>
              <p className="text-background/75 leading-relaxed">
                Downloading is free. If you'd like to help me make the next part, you can buy me a coffee on Ko-fi, but
                only if you want to. Reading it and passing it on already means a lot to me.
              </p>
            </div>

            <div className="bg-white/[0.06] border border-white/10 rounded-3xl p-6 md:p-7">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 mb-3">
                <span className="text-sm text-background/70">Couplets translated so far</span>
                <span className="font-heading font-semibold text-lg">
                  {TRANSLATED} <span className="text-background/60 font-normal text-sm">of {TOTAL_KURALS.toLocaleString("en-US")}</span>
                </span>
              </div>
              <div
                className="h-3 rounded-full bg-white/10 overflow-hidden mb-7"
                role="img"
                aria-label={`${TRANSLATED} of ${TOTAL_KURALS} couplets translated so far`}
              >
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-rose-400 to-amber-300"
                  initial={{ width: 0 }}
                  whileInView={{ width: `${progress}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                />
              </div>

              <p className="text-sm text-background/70 mb-3">Ways to help, all optional:</p>
              <ol className="space-y-2.5 text-sm">
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Download size={15} aria-hidden="true" /></span>
                  Download and read it
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0"><Share2 size={15} aria-hidden="true" /></span>
                  Share it with someone who would enjoy it
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0"><Coffee size={15} aria-hidden="true" /></span>
                  <a
                    href={KOFI_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 decoration-primary hover:text-white rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    data-testid="link-thirukkural-kofi-card"
                  >
                    Buy me a coffee on Ko-fi<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              </ol>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
