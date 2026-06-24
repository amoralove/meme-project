"use client";

import { useState, useRef, useEffect } from "react";
import type { ChatMessage, MatchResult } from "@/types";

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [started, setStarted] = useState(false);
  const messagesEnd = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(content: string) {
    const userMessage: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const data = await res.json();

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.message,
        timestamp: new Date().toISOString(),
      };

      setMessages([...updatedMessages, assistantMessage]);

      if (data.matches) {
        setMatches(data.matches);
      }
    } catch {
      const errorMessage: ChatMessage = {
        role: "assistant",
        content:
          "Sorry, something went wrong! Please try again in a moment.",
        timestamp: new Date().toISOString(),
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleStart() {
    setStarted(true);
    sendMessage(
      "Hi! I'm looking to adopt a rescue dog and would love your help finding one that's a good fit for me."
    );
  }

  return (
    <div
      className="max-w-2xl mx-auto bg-white border-3 border-pencil shadow-[8px_8px_0px_0px_#2d2d2d] relative overflow-hidden"
      style={{
        borderRadius: "30px 255px 30px 255px / 255px 30px 255px 30px",
      }}
    >
      {/* Tape decoration */}
      <div
        className="absolute top-[-6px] left-1/2 -translate-x-1/2 -rotate-1 w-[120px] h-7 bg-forest/20 border-2 border-pencil/15 rounded z-10"
      />

      {/* Messages */}
      <div className="p-6 pt-10 min-h-[300px] max-h-[500px] overflow-y-auto flex flex-col gap-4">
        {!started && (
          <div className="flex gap-3">
            <div className="w-10 h-10 border-2 border-pencil blob-1 flex items-center justify-center text-xl shrink-0 bg-paper">
              &#x1f43e;
            </div>
            <div
              className="bg-paper border-2 border-pencil p-4 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)]"
              style={{
                borderRadius:
                  "255px 15px 225px 15px / 15px 225px 15px 255px",
              }}
            >
              <p>
                Hi there! I&apos;m Wescue, and I&apos;m here to help you
                find a rescue dog that&apos;s perfect for your life.
              </p>
              <p className="mt-2">
                I&apos;ll ask a few quick questions — nothing long or
                complicated. Ready to find your match?
              </p>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 max-w-[85%] animate-[fadeInUp_0.3s_ease] ${
              msg.role === "user"
                ? "self-end flex-row-reverse"
                : "self-start"
            }`}
          >
            <div
              className={`w-10 h-10 border-2 border-pencil blob-1 flex items-center justify-center text-xl shrink-0 ${
                msg.role === "user"
                  ? "bg-forest text-white text-xs font-heading font-bold"
                  : "bg-paper"
              }`}
            >
              {msg.role === "user" ? "You" : "\u{1F43E}"}
            </div>
            <div
              className={`border-2 p-4 ${
                msg.role === "user"
                  ? "bg-forest text-white border-forest-dark shadow-[3px_3px_0px_0px_#1b4332]"
                  : "bg-paper border-pencil shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)]"
              }`}
              style={{
                borderRadius:
                  msg.role === "user"
                    ? "15px 255px 15px 225px / 225px 15px 255px 15px"
                    : "255px 15px 225px 15px / 15px 225px 15px 255px",
              }}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 self-start">
            <div className="w-10 h-10 border-2 border-pencil blob-1 flex items-center justify-center text-xl shrink-0 bg-paper">
              &#x1f43e;
            </div>
            <div
              className="bg-paper border-2 border-pencil p-4 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)]"
              style={{
                borderRadius:
                  "255px 15px 225px 15px / 15px 225px 15px 255px",
              }}
            >
              <p className="animate-pulse">thinking...</p>
            </div>
          </div>
        )}

        {/* Match Results */}
        {matches && (
          <div className="flex gap-3 self-start max-w-[90%]">
            <div className="w-10 h-10 border-2 border-pencil blob-1 flex items-center justify-center text-xl shrink-0 bg-paper">
              &#x1f43e;
            </div>
            <div
              className="bg-paper border-2 border-pencil p-4 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)]"
              style={{
                borderRadius:
                  "255px 15px 225px 15px / 15px 225px 15px 255px",
              }}
            >
              <p className="font-heading font-bold text-lg mb-3">
                Your top matches:
              </p>
              <div className="flex flex-col gap-3">
                {matches.map((match, i) => (
                  <a
                    key={i}
                    href={`/dogs/${match.dog.id}`}
                    className="flex gap-3 p-3 border-2 border-pencil bg-white wobbly-1 shadow-[3px_3px_0px_0px_rgba(45,45,45,0.15)] hover:shadow-[4px_4px_0px_0px_#2d2d2d] hover:rotate-[-1deg] transition-transform duration-100"
                  >
                    <span className="text-3xl shrink-0">&#x1f436;</span>
                    <div>
                      <h4 className="font-heading font-bold">
                        {match.dog.name}
                        <span className="ml-2 inline-block bg-forest text-white text-xs font-bold px-2 py-0.5 border-2 border-pencil wobbly-1">
                          {match.score}%
                        </span>
                      </h4>
                      <p className="text-sm opacity-60">
                        {match.dog.breed_primary} &middot; {match.dog.size}
                      </p>
                      <p className="text-sm text-forest mt-0.5">
                        {match.reasons[0]}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEnd} />
      </div>

      {/* Start buttons or input */}
      {!started ? (
        <div className="px-6 pb-5 flex flex-wrap gap-3">
          <button
            className="btn-sketchy text-base px-5 py-2.5 border-2 border-forest text-forest shadow-[3px_3px_0px_0px_#2d6a4f] hover:bg-forest hover:text-white"
            onClick={handleStart}
          >
            Yes, let&apos;s do it!
          </button>
          <a
            href="/dogs"
            className="btn-sketchy text-base px-5 py-2.5 border-2 border-forest text-forest shadow-[3px_3px_0px_0px_#2d6a4f] hover:bg-forest hover:text-white"
          >
            I&apos;d rather browse first
          </a>
        </div>
      ) : (
        <div className="flex gap-3 px-6 pb-5 border-t-2 border-dashed border-erased pt-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim() && !loading)
                sendMessage(input.trim());
            }}
            placeholder="Type your answer..."
            disabled={loading}
            className="flex-1 px-4 py-3 border-2 border-pencil font-body text-base outline-none bg-white focus:border-forest focus:ring-2 focus:ring-forest/20 disabled:opacity-50 wobbly-1"
          />
          <button
            onClick={() => {
              if (input.trim() && !loading) sendMessage(input.trim());
            }}
            disabled={loading || !input.trim()}
            className="btn-sketchy btn-primary text-base px-6 py-3 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}
