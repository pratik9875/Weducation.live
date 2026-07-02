"use client";

import { useEffect, useRef, useState } from "react";

type Message = { from: "bot" | "student"; text: string; time: string };

const conversation: Message[] = [
  {
    from: "bot",
    text: "👋 Hi! I'm PA Inamdar University's Admission Assistant. What's your name?",
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
    <div className="mx-auto w-[300px]">
      {/* Phone frame */}
      <div className="relative rotate-1 rounded-[3rem] bg-gradient-to-b from-slate-800 to-slate-950 p-2.5 shadow-2xl ring-1 ring-black/10">
        {/* Side buttons */}
        <div className="absolute -left-[3px] top-24 h-8 w-[3px] rounded-l bg-slate-700" />
        <div className="absolute -left-[3px] top-36 h-14 w-[3px] rounded-l bg-slate-700" />
        <div className="absolute -right-[3px] top-32 h-20 w-[3px] rounded-r bg-slate-700" />

        <div className="relative overflow-hidden rounded-[2.4rem] bg-[#efeae2] ring-1 ring-black/20">
          {/* Dynamic island */}
          <div className="absolute left-1/2 top-2 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

          {/* WhatsApp header */}
          <div className="relative z-10 flex items-center gap-2.5 bg-brand-700 px-4 pb-3 pt-8 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0 text-white/90">
              <path d="M15.5 3.5 7 12l8.5 8.5 1.4-1.4L9.8 12l7.1-7.1z" />
            </svg>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              PA
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight">
                PA Inamdar University
              </p>
              <p className="text-[11px] text-brand-100">
                {typing ? "typing…" : "online"}
              </p>
            </div>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-[18px] w-[18px] shrink-0 text-white/90">
              <path d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11z" />
            </svg>
          </div>

          {/* Chat body */}
          <div
            ref={scrollRef}
            className="relative flex h-[430px] flex-col gap-1.5 overflow-hidden px-3 py-4"
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
            <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[13px] text-slate-400 shadow-sm">
              Type a message
            </div>
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
              </svg>
            </div>
          </div>

          {/* Home indicator */}
          <div className="flex justify-center bg-[#f0ede8] pb-2">
            <div className="h-1 w-24 rounded-full bg-slate-900/70" />
          </div>
        </div>
      </div>
    </div>
  );
}
