"use client";

import { useEffect, useRef, useState } from "react";

type Message = { from: "bot" | "student"; text: string; time: string };

const conversation: Message[] = [
  {
    from: "bot",
    text: "👋 Hi! I'm University's Admission Assistant. What's your name?",
    time: "10:02",
  },
  { from: "student", text: "Priya Sharma", time: "10:02" },
  {
    from: "bot",
    text: "Nice to meet you, Priya! Which course are you interested in — Engineering, Management, Law, Education, Healthcare, or Arts & Science?",
    time: "10:03",
  },
  { from: "student", text: "Engineering, BCA", time: "10:03" },
  {
    from: "bot",
    text: "Great choice ✅\nBCA — Fee: ₹85,000/yr · Duration: 3 yrs · Eligibility: 10+2 with Maths.\n\nWant to start your application?",
    time: "10:04",
  },
  { from: "student", text: "Yes, let's start", time: "10:04" },
  {
    from: "bot",
    text: "Perfect! Send a photo of your 12th marksheet to begin 📎",
    time: "10:05",
  },
];

const BOT_TYPING_MS = 1100;
const STUDENT_PAUSE_MS = 700;
const HOLD_AFTER_LAST_MS = 2600;
const RESTART_PAUSE_MS = 500;

export function WhatsAppPreview() {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    function schedule(fn: () => void, ms: number) {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    }

    function playFrom(index: number) {
      if (index >= conversation.length) {
        schedule(() => {
          setVisibleCount(0);
          schedule(() => playFrom(0), RESTART_PAUSE_MS);
        }, HOLD_AFTER_LAST_MS);
        return;
      }

      const next = conversation[index];
      const delay = next.from === "bot" ? BOT_TYPING_MS : STUDENT_PAUSE_MS;

      if (next.from === "bot") setTyping(true);
      schedule(() => {
        setTyping(false);
        setVisibleCount(index + 1);
        schedule(() => playFrom(index + 1), 550);
      }, delay);
    }

    playFrom(0);
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [visibleCount, typing]);

  return (
    <div className="relative mx-auto w-[300px]">
      {/* Floating notification chips around the phone */}
      <div className="animate-chip-float absolute -left-32 top-24 z-10 hidden items-center gap-2.5 rounded-xl border border-slate-100 bg-white/90 px-3.5 py-2.5 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.25)] backdrop-blur lg:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-4 w-4">
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-800">Marksheet verified</p>
          <p className="text-[10px] text-slate-400">2 min ago · auto-checked</p>
        </div>
      </div>
      <div className="animate-chip-float-delayed absolute -right-28 bottom-32 z-10 hidden items-center gap-2.5 rounded-xl border border-slate-100 bg-white/90 px-3.5 py-2.5 shadow-[0_12px_30px_-10px_rgba(15,23,42,0.25)] backdrop-blur lg:flex">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#25d366]/15 text-[#128c7e]">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <rect x="3" y="6" width="18" height="13" rx="2" />
            <path d="M3 10h18" />
          </svg>
        </div>
        <div>
          <p className="text-[11px] font-semibold text-slate-800">₹85,000 fee received</p>
          <p className="text-[10px] text-slate-400">Razorpay · reconciled</p>
        </div>
      </div>

      {/* Phone frame — continuously floating */}
      <div className="animate-phone-float relative rounded-[2.75rem] bg-gradient-to-b from-slate-700 via-slate-900 to-slate-950 p-[10px] shadow-[0_30px_60px_-15px_rgba(15,23,42,0.35)] ring-1 ring-black/10">
        {/* Side buttons, symmetric */}
        <div className="absolute -left-px top-[88px] h-7 w-[3px] rounded-l-sm bg-slate-600" />
        <div className="absolute -left-px top-[124px] h-12 w-[3px] rounded-l-sm bg-slate-600" />
        <div className="absolute -left-px top-[180px] h-12 w-[3px] rounded-l-sm bg-slate-600" />
        <div className="absolute -right-px top-[124px] h-16 w-[3px] rounded-r-sm bg-slate-600" />

        <div className="relative overflow-hidden rounded-[2.15rem] bg-[#efeae2] ring-1 ring-black/25">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-2.5 z-20 h-6 w-[88px] -translate-x-1/2 rounded-full bg-black" />

          {/* WhatsApp header — WhatsApp's own signature dark teal */}
          <div className="relative z-10 flex items-center gap-2.5 bg-[#075e54] px-4 pb-3 pt-9 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-white/90">
              <path d="M15.5 3.5 7 12l8.5 8.5 1.4-1.4L9.8 12l7.1-7.1z" />
            </svg>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold ring-2 ring-white/10">
              U
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight">University</p>
              <p className="text-[11px] text-white/70">{typing ? "typing…" : "online"}</p>
            </div>
            <div className="flex items-center gap-4 text-white/90">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px]">
                <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z" />
              </svg>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M6.6 10.8c1.4 2.8 3.7 5 6.5 6.5l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.7.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.7.1.4 0 .8-.2 1z" />
              </svg>
            </div>
          </div>

          {/* Chat body */}
          <div
            ref={scrollRef}
            className="relative flex h-[440px] flex-col gap-1.5 overflow-hidden px-3 py-4"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20px 20px, rgba(0,0,0,0.035) 1.5px, transparent 0)",
              backgroundSize: "24px 24px",
            }}
          >
            {conversation.slice(0, visibleCount).map((msg, i) => (
              <div
                key={i}
                className={`flex animate-[fadeIn_0.25s_ease-out] ${
                  msg.from === "student" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[78%] whitespace-pre-line rounded-lg px-3 py-1.5 text-[13px] leading-snug shadow-sm ${
                    msg.from === "student"
                      ? "rounded-tr-none bg-[#d9fdd3] text-slate-800"
                      : "rounded-tl-none bg-white text-slate-800"
                  }`}
                >
                  {msg.text}
                  <span className="ml-2 inline-block align-bottom text-[10px] text-slate-400">
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-lg rounded-tl-none bg-white px-3 py-2.5 shadow-sm">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" />
                </div>
              </div>
            )}
          </div>

          {/* Input bar */}
          <div className="flex items-center gap-2 border-t border-black/5 bg-[#f0ede8] px-3 py-2.5">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4 shrink-0 text-slate-400">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 14s1.2 1.5 3.5 1.5 3.5-1.5 3.5-1.5M9 9.5h.01M15 9.5h.01" strokeLinecap="round" />
              </svg>
              <span className="flex-1 text-[13px] text-slate-400">Type a message</span>
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-slate-400">
                <path d="M12 15.5a3.5 3.5 0 0 0 3.5-3.5V6a3.5 3.5 0 0 0-7 0v6a3.5 3.5 0 0 0 3.5 3.5zM17.5 12a5.5 5.5 0 0 1-11 0H5a7 7 0 0 0 6 6.92V21h2v-2.08A7 7 0 0 0 19 12z" />
              </svg>
            </div>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </div>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center bg-[#f0ede8] pb-2 pt-0.5">
            <div className="h-1 w-28 rounded-full bg-slate-900/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
