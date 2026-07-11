import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  Code2,
  FileSearch,
  LayoutDashboard,
  Share2,
  Coffee,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const TECH_STACK = [
  "React 19", "TypeScript", "Tailwind CSS", "Zustand",
  "Node.js", "Express", "PostgreSQL", "Prisma",
  "Monaco Editor", "Google Gemini", "OpenAI", "Docker",
  "Azure", "Redis", "BullMQ", "Cloudinary",
];

const FEATURES = [
  {
    icon: BookOpen,
    title: "Learning Hub",
    description:
      "Striver's A2Z DSA and Blind 75, rating-tiered Codeforces sheets, Core CS (DBMS, OOPS, OS) with lectures and docs, and a system design blueprint with real-world case studies.",
  },
  {
    icon: Code2,
    title: "Practice Arena",
    description:
      "Company-tagged DSA questions filterable by difficulty, company, topic, and solved status. Write real code, run it securely, and get instant AI feedback with time and space complexity.",
  },
  {
    icon: FileSearch,
    title: "ATS Checker",
    description:
      "An honest resume score, not a flattering one. Get your top 5 target role matches, missing keywords to add, and line-by-line rewrite suggestions before you actually apply.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard & history",
    description:
      "A consistency heatmap tracking daily DSA practice and mock interviews, plus a full history of every interview you've taken with scores you can look back on.",
  },
  {
    icon: Share2,
    title: "Shareable report cards",
    description:
      "Every mock interview generates a report card you can share with a single click — a public link, no login required for whoever you send it to.",
  },
];

const PAGE_URL = "https://roundoneprep.me/about";
const PAGE_TITLE = "About RoundOne — Built by a student, for students preparing for FAANG interviews";
const PAGE_DESCRIPTION =
  "RoundOne is an AI-powered mock interview platform built by Anurag Mishra to help students prepare for technical interviews with real code execution, an honest ATS resume checker, a structured DSA/CP/CS/system design learning hub, and shareable interview report cards.";

function AboutUs() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[var(--bg)]">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content="https://roundoneprep.me/og-image.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            url: PAGE_URL,
            mainEntity: {
              "@type": "SoftwareApplication",
              name: "RoundOne",
              applicationCategory: "EducationalApplication",
              operatingSystem: "Web",
              description: PAGE_DESCRIPTION,
              author: {
                "@type": "Person",
                name: "Anurag Mishra",
                sameAs: [
                  "https://github.com/Anurag-Mishra2006",
                  "https://www.linkedin.com/in/anurag-mishra-256101318/",
                ],
              },
            },
          })}
        </script>
      </Helmet>

      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, #3b82f6 45%, transparent 70%)" }}
      />
      <Navbar />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-24 pt-20">
        {/* Hero */}
        <div className="text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--accent)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            BUILT BY ONE DEVELOPER
          </span>

          <h1 className="text-4xl font-extrabold leading-tight text-[var(--text)] sm:text-5xl">
            Interview prep, built by
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              someone still preparing.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-[var(--text-muted)]">
            RoundOne isn't built by a company with a hiring-prep budget. It's
            built by a student who got tired of mock interviews that felt
            nothing like the real thing.
          </p>
        </div>

        {/* Why RoundOne exists */}
        <section className="mt-16">
          <h2 className="text-lg font-bold text-[var(--text)]">Why RoundOne exists</h2>
          <p className="mt-3 text-[var(--text-muted)]">
            Most mock interview tools either ask generic DSA questions with no
            context on your background, or they're just a chat window
            pretending to be an interviewer. Neither prepares you for what
            actually happens in a FAANG loop — a recruiter who's read your
            resume, a live coding round with real execution, and pressure
            that a text box can't simulate.
          </p>
          <p className="mt-3 text-[var(--text-muted)]">
            RoundOne closes that gap: upload your resume, get interview
            questions tailored to it, write and run real code in an actual
            editor, and eventually — talk through your answers out loud, the
            way a real interview works.
          </p>
        </section>

        {/* What's inside */}
        <section className="mt-16">
          <h2 className="text-lg font-bold text-[var(--text)]">What's inside</h2>
          <p className="mt-3 text-[var(--text-muted)]">
            Interview prep is more than one feature. Here's everything
            RoundOne actually does, end to end.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
              >
                <feature.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
                <p className="mt-3 text-sm font-semibold text-[var(--text)]">{feature.title}</p>
                <p className="mt-1.5 text-sm text-[var(--text-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--text)]">Who's building this</h2>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-violet-500 to-blue-500 text-lg font-bold text-white">
              AM
            </div>
            <div>
              <p className="font-semibold text-[var(--text)]">Anurag Mishra</p>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                3rd-year IT student @MMMUT, open-source learner, and
                competitive programmer. Building RoundOne solo — from the
                interview logic to the UI you're looking at right now —
                while prepping for the same interviews it's designed to help
                with.
              </p>
              <div className="mt-3 flex gap-4 text-sm">
                <a
                  href="https://github.com/Anurag-Mishra2006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/anurag-mishra-256101318/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Tech stack */}
        <section className="mt-16">
          <h2 className="text-lg font-bold text-[var(--text)]">What it's built with</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {TECH_STACK.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-sm text-[var(--text-muted)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Support / Buy me a chai */}
        <section className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
          <Coffee className="mx-auto h-6 w-6 text-orange-400" strokeWidth={1.75} />
          <h2 className="mt-3 text-lg font-bold text-[var(--text)]">
            If RoundOne helped you, consider buying me a chai
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-[var(--text-muted)]">
            No subscriptions, no upsells — just a solo student building this
            in between classes and interview prep of my own. If it's been
            useful, a chai goes a long way.
          </p>
          <a
            href="https://buymeachai.ezee.li/supreme_1"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
          >
            <Coffee className="h-4 w-4" strokeWidth={2} />
            Buy me a chai
          </a>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
