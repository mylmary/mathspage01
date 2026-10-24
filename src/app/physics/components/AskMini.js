
"use client";

import { useEffect, useRef, useState } from "react";

const suggestions = [
  "Why does a vortex form behind a cylinder?",
  "What is the difference between pressure and velocity?",
  "Explain the lid-driven cavity experiment.",
];

export default function AskMini() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hi! I'm Mini 👋 Ask me about fluid flow, the physics behind an experiment, or what to look for in a simulation.",
    },
  ]);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, open]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  async function sendMessage(text = input) {
    const question = text.trim();

    if (!question || loading) return;

    const nextMessages = [
      ...messages,
      { role: "user", text: question },
    ];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ask-mini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages
            .filter((message) => message.role !== "model" || message.text)
            .map(({ role, text: messageText }) => ({
              role,
              text: messageText,
            })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Mini couldn't respond.");
      }

      setMessages((current) => [
        ...current,
        { role: "model", text: data.reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "model",
          text:
            error.message ||
            "I couldn't connect just now. Please try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] sm:bottom-6 sm:right-6"
      onKeyDown={handleKeyDown}
    >
      {open && (
        <section
          aria-label="Ask Mini AI chat"
          className="mb-3 flex h-[min(590px,calc(100dvh-110px))] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_80px_rgba(17,24,39,0.22)]"
        >
          <header className="flex items-center justify-between gap-3 bg-[#35143F] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">
                M
              </div>
              <div>
                <h2 className="font-semibold">Ask Mini</h2>
                <p className="mt-0.5 text-xs text-white/75">
                  Your Physics Lab assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="flex h-10 w-10 items-center justify-center rounded-full text-xl text-white/90 transition hover:bg-white/15"
            >
              ×
            </button>
          </header>

          <div
            className="flex-1 space-y-4 overflow-y-auto bg-[#F7F9FC] p-4"
            aria-live="polite"
            aria-relevant="additions text"
          >
            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[88%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-sm leading-6 ${
                    message.role === "user"
                      ? "rounded-br-md bg-[#087F98] text-white"
                      : message.error
                      ? "rounded-bl-md border border-amber-200 bg-amber-50 text-slate-700"
                      : "rounded-bl-md border border-slate-200 bg-white text-slate-700 shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-medium text-slate-500">
                  Try asking
                </p>
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={loading}
                    onClick={() => sendMessage(suggestion)}
                    className="block w-full rounded-xl border border-[#C8E8ED] bg-white px-3 py-2.5 text-left text-sm leading-5 text-slate-700 transition hover:border-[#087F98] hover:bg-[#EFF9FA] disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div
                  className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500"
                  role="status"
                >
                  Mini is thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="border-t border-slate-200 bg-white p-3"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-slate-300 bg-white p-2 focus-within:border-[#087F98] focus-within:ring-2 focus-within:ring-[#087F98]/15">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about fluid flow..."
                aria-label="Message Mini"
                rows={1}
                maxLength={4000}
                className="max-h-28 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#087F98] text-white transition hover:bg-[#06677B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M4 12 20 4l-5 16-3-7-8-1Z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="m12 13 8-9"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] leading-4 text-slate-400">
              AI can make mistakes. Verify important scientific results.
            </p>
          </form>
        </section>
      )}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          aria-expanded={open}
          aria-label={open ? "Close Ask Mini" : "Open Ask Mini"}
          className="flex min-h-14 items-center gap-2 rounded-full bg-[#35143F] px-5 text-white shadow-[0_8px_30px_rgba(53,20,63,0.28)] transition hover:-translate-y-0.5 hover:bg-[#4B2058] focus:outline-none focus:ring-4 focus:ring-[#35143F]/20"
        >
          {open ? (
            <span className="text-xl" aria-hidden="true">
              ×
            </span>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d="M4 5h16M4 12h11M4 19h7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <path
                d="m17 15 3 3-3 3"
                stroke="#8CE0E8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span className="text-sm font-semibold">
            {open ? "Close Mini" : "Ask Mini"}
          </span>
          {!open && (
            <span className="h-2 w-2 rounded-full bg-[#8CE0E8]" />
          )}
        </button>
      </div>
    </div>
  );
}
