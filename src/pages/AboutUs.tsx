import { Helmet } from "react-helmet-async";
import {
  BookOpen,
  Code2,
  FileSearch,
  LayoutDashboard,
  Share2,
  Coffee,
  MessageSquare,
  FileEdit,
} from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import useUserStore from "@/store/authStore";

const TECH_STACK = [
  "React 19", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand",  
  "Node.js", "Express", "PostgreSQL", "Prisma",
  "Monaco Editor", "React-PDF", "Google Gemini", "Groq (Whisper)",  
  "Docker", "Redis", "BullMQ", "Cloudinary",
];

const FEATURES = [
  {
    icon: MessageSquare,
    title: "AI Mock Interviews",
    description:
      "Experience a realistic interview with AI-driven voice and text conversations. The platform displays and speaks each question (TTS), while you answer by voice or typing. Complete 5 HR questions, 5 technical questions, and 1 DSA coding round.",
  },
  {
    icon: Code2,
    title: "Practice Arena & Online Judge",
    description:
      "Company-tagged DSA questions filterable by difficulty, company, topic, and solved status. Write real code, run it securely in isolated Docker containers, and get instant LeetCode-style verdicts (AC, WA, TLE, MLE).",
  },
  {
    icon: FileEdit,
    title: "AI Resume Builder",
    description:
      "Don't have an ATS-friendly resume? Build one from scratch. Use the 'Interrogative AI' to transform vague project descriptions into FAANG-standard, data-driven bullet points, and instantly generate a perfect single-column PDF.",
  },
  {
    icon: FileSearch,
    title: "FAANG ATS Checker",
    description:
      "An honest resume score, not a flattering one. Get your top 5 target role matches, missing keywords to add, and line-by-line rewrite suggestions before you actually apply.",
  },
  {
    icon: BookOpen,
    title: "Learning Hub",
    description:
      "Striver's A2Z DSA and Blind 75, rating-tiered Codeforces sheets, Core CS (DBMS, OOPS, OS) with lectures and docs, and a system design blueprint with real-world case studies.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard & History",
    description:
      "A consistency heatmap tracking daily DSA practice and mock interviews, plus a full history of every interview you've taken with scores you can look back on.",
  },
  {
    icon: Share2,
    title: "Shareable Report Cards",
    description:
      "Every mock interview generates a report card you can share with a single click — a public link, no login required for whoever you send it to.",
  },
];

const PAGE_URL = "https://roundoneprep.me/about";
const PAGE_TITLE = "About RoundOne — Built by a student, for students preparing for FAANG interviews";
const PAGE_DESCRIPTION =
  "RoundOne is an AI-powered mock interview platform built by Anurag Mishra to help students prepare for technical interviews with real code execution, an honest ATS resume checker, a smart AI resume builder, and structured learning roadmaps.";

function AboutUs() {
  const { user } = useUserStore()
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
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-8">
        <Link
          to={user ? "/dashboard" : "/"}
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to {user ? "Dashboard" : "Home"}
        </Link>
      </div>
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
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--accent)] shadow-lg shadow-[var(--accent)]/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            BUILT BY ONE DEVELOPER
          </span>

          <h1 className="text-4xl font-extrabold leading-tight text-[var(--text)] sm:text-5xl">
            Interview prep, built by
            <br />
            <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
              someone still preparing.
            </span>
          </h1>

          <div className="mx-auto mt-6 max-w-2xl space-y-5 text-center">
            <p className="text-base leading-8 text-[var(--text-muted)]">
              RoundOne wasn't created by a large company—it was started by a student
              learning software development while preparing for technical interviews.
              Like many others, he found himself constantly switching between websites
              for DSA, mock interviews, resume reviews, and interview preparation.
            </p>

            <p className="text-base leading-8 text-[var(--text-muted)]">
              RoundOne is an attempt to bring those essential resources together into
              one platform, making interview preparation simpler, more realistic, and
              more accessible for everyone who is on the same journey.
            </p>
          </div>
        </div>

        {/* Why RoundOne exists */}
        <section className="mt-16">
          <h2 className="text-lg font-bold text-[var(--text)]">Why RoundOne exists</h2>
          <div className="mt-3 space-y-4 text-[var(--text-muted)] leading-relaxed">
            <p>
              Most mock interview tools either ask generic DSA questions with no
              context on your background, or they're just a chat window
              pretending to be an interviewer. Neither prepares you for what
              actually happens in a FAANG loop — a recruiter who's read your
              resume, a live coding round with real execution, and pressure
              that a text box can't simulate.
            </p>
            <p>
              RoundOne closes that gap: upload (or build) your resume, get interview
              questions tailored to it, write and run real code against hidden test cases in an actual
              editor, and eventually — talk through your answers out loud, the
              way a real interview works.
            </p>
          </div>
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
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 hover:border-[var(--accent)]/50 transition-colors"
              >
                <feature.icon className="h-5 w-5 text-[var(--accent)]" strokeWidth={1.75} />
                <p className="mt-3 text-sm font-bold text-[var(--text)]">{feature.title}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <section className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 sm:p-8">
          <h2 className="text-lg font-bold text-[var(--text)]">Who's building this</h2>
          <div className="mt-4 flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 via-violet-500 to-blue-500 text-lg font-bold text-white shadow-lg shadow-purple-500/20">
              AM
            </div>
            <div>
              <p className="font-semibold text-[var(--text)]">Anurag Mishra</p>
              <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">
                3rd-year IT student @MMMUT, open-source learner, and
                competitive programmer. Building RoundOne solo — from the
                custom Docker execution engine to the UI you're looking at right now —
                while prepping for the same interviews it's designed to help with.
              </p>
              <div className="mt-4 flex gap-4 text-sm font-medium">
                <a
                  href="https://github.com/Anurag-Mishra2006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  GitHub ↗
                </a>
                <a
                  href="https://www.linkedin.com/in/anurag-mishra-256101318/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent)] hover:underline flex items-center gap-1"
                >
                  LinkedIn ↗
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
                className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-sm text-[var(--text-muted)] hover:text-white hover:border-[var(--text-muted)] transition-colors cursor-default"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Support / Buy me a chai */}
        <section className="mt-16 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <Coffee className="mx-auto h-8 w-8 text-orange-400 mb-4" strokeWidth={1.75} />
            <h2 className="text-xl font-bold text-[var(--text)]">
              If RoundOne helped you, consider buying me a chai
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--text-muted)] leading-relaxed">
              No subscriptions, no upsells, no paywalls — just a solo student building this
              in between classes and interview prep of my own. If it's been
              useful to you, a chai goes a long way.
            </p>
            <a
              href="https://buymeachai.ezee.li/supreme_1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-6 py-3 text-sm font-bold text-white shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all"
            >
              <Coffee className="h-4 w-4" strokeWidth={2.5} />
              Buy me a chai
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
