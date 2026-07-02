const conversation = [
  {
    from: "bot" as const,
    text: "👋 Hi! I'm PA Inamdar University's Admission Assistant. What's your name?",
    time: "10:02",
  },
  { from: "student" as const, text: "Priya Sharma", time: "10:02" },
  {
    from: "bot" as const,
    text: "Nice to meet you, Priya! Which course are you interested in — Engineering, Management, Law, Education, Healthcare, or Arts & Science?",
    time: "10:03",
  },
  { from: "student" as const, text: "Engineering, BCA", time: "10:03" },
  {
    from: "bot" as const,
    text: "Great choice ✅\nBCA — Fee: ₹85,000/yr · Duration: 3 yrs · Eligibility: 10+2 with Maths.\n\nWant to start your application?",
    time: "10:04",
  },
  { from: "student" as const, text: "Yes, let's start", time: "10:04" },
  {
    from: "bot" as const,
    text: "Perfect! Send a photo of your 12th marksheet to begin 📎",
    time: "10:05",
  },
];

export function WhatsAppPreview() {
  return (
    <div className="mx-auto w-[300px] select-none rotate-1 rounded-[2.5rem] border-[8px] border-slate-900 bg-slate-900 shadow-2xl">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#e9e3d9]">
        {/* Notch */}
        <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-xl bg-slate-900" />

        {/* WhatsApp header */}
        <div className="flex items-center gap-3 bg-brand-700 px-4 pb-3 pt-7 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
            PA
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">PA Inamdar University</p>
            <p className="text-[11px] text-brand-100">online</p>
          </div>
        </div>

        {/* Chat body */}
        <div className="flex h-[430px] flex-col gap-2 overflow-hidden px-3 py-4">
          {conversation.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.from === "student" ? "justify-end" : "justify-start"}`}
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
        </div>

        {/* Input bar */}
        <div className="flex items-center gap-2 border-t border-black/5 bg-[#f0ede8] px-3 py-2.5">
          <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[13px] text-slate-400 shadow-sm">
            Type a message
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-white">
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
