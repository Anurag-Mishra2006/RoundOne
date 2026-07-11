import { useState, type FormEvent } from "react";
import emailjs from "@emailjs/browser";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

type FeedbackType = "general" | "bug" | "feature" | "other";

const FEEDBACK_OPTIONS: { value: FeedbackType; label: string }[] = [
    { value: "general", label: "General feedback" },
    { value: "bug", label: "Report a bug" },
    { value: "feature", label: "Feature request" },
    { value: "other", label: "Something else" },
];

function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState<FeedbackType>("general");
    const [message, setMessage] = useState("");
    const [company, setCompany] = useState(""); // honeypot, kept empty by real users

    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
        "idle"
    );

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (company) return; // bot filled the honeypot, silently drop

        if (!name.trim() || !email.trim() || !message.trim()) {
            setStatus("error");
            return;
        }

        setStatus("sending");

        try {
            await emailjs.send(
                SERVICE_ID,
                TEMPLATE_ID,
                {
                    from_name: name,
                    from_email: email,
                    feedback_type: FEEDBACK_OPTIONS.find((o) => o.value === type)
                        ?.label,
                    message,
                },
                { publicKey: PUBLIC_KEY }
            );

            setStatus("sent");
            setName("");
            setEmail("");
            setType("general");
            setMessage("");
        } catch (err) {
            console.error("EmailJS send failed:", err);
            setStatus("error");
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[var(--bg)]">
            <div className="relative z-10 mx-auto max-w-3xl px-6 pt-8">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </div>
            <div
                className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
                style={{
                    background:
                        "radial-gradient(circle, #8b5cf6 0%, #3b82f6 45%, transparent 70%)",
                }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.15]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle, var(--border) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                }}
            />

            <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center px-6 pb-24 pt-20 text-center">
                <span className="mb-6 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium text-[var(--accent)]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                    WE READ EVERY MESSAGE
                </span>

                <h1 className="text-4xl font-extrabold leading-tight text-[var(--text)] sm:text-5xl">
                    Help us build
                    <br />
                    <span className="bg-gradient-to-r from-pink-500 via-violet-500 to-blue-500 bg-clip-text text-transparent">
                        something better.
                    </span>
                </h1>

                <p className="mt-5 max-w-md text-[var(--text-muted)]">
                    Found a bug, have an idea, or just want to say hi? Tell us what's
                    on your mind — we actually read these.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 text-left sm:p-8"
                >
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="hidden"
                        tabIndex={-1}
                        autoComplete="off"
                    />

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                                Name
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Anurag Mishra"
                                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                            />
                        </div>

                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                            />
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                            What's this about?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {FEEDBACK_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setType(opt.value)}
                                    className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${type === opt.value
                                        ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                                        : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)]"
                                        }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="mt-5">
                        <label className="mb-1.5 block text-sm font-medium text-[var(--text)]">
                            Message
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={5}
                            placeholder="Tell us what happened, or what you'd love to see..."
                            className="w-full resize-none rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3.5 py-2.5 text-sm text-[var(--text)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                        />
                    </div>

                    {status === "error" && (
                        <p className="mt-4 text-sm text-[var(--danger)]">
                            Please fill in your name, email, and message before sending.
                        </p>
                    )}

                    {status === "sent" ? (
                        <div className="mt-6 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-4 py-3 text-center text-sm font-medium text-[var(--accent)]">
                            Thanks — your message is in. We'll get back to you soon.
                        </div>
                    ) : (
                        <button
                            type="submit"
                            disabled={status === "sending"}
                            className="mt-6 w-full rounded-lg bg-white py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-60"
                        >
                            {status === "sending" ? "Sending..." : "Send message"}
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default ContactUs;
