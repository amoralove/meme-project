"use client";

import { useState, useCallback } from "react";
import type { ChatMessage, MatchResult, AdopterPreferences } from "@/types";

interface UseChatReturn {
  messages: ChatMessage[];
  matches: MatchResult[] | null;
  preferences: AdopterPreferences | null;
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  reset: () => void;
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [matches, setMatches] = useState<MatchResult[] | null>(null);
  const [preferences, setPreferences] = useState<AdopterPreferences | null>(null);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        role: "user",
        content,
        timestamp: new Date().toISOString(),
      };

      const updated = [...messages, userMessage];
      setMessages(updated);
      setLoading(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: updated }),
        });

        if (!res.ok) throw new Error("Chat request failed");

        const data = await res.json();

        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.message,
          timestamp: new Date().toISOString(),
        };

        setMessages([...updated, assistantMessage]);

        if (data.preferences) setPreferences(data.preferences);
        if (data.matches) setMatches(data.matches);
      } catch {
        setMessages([
          ...updated,
          {
            role: "assistant",
            content: "Sorry, something went wrong. Please try again!",
            timestamp: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setMatches(null);
    setPreferences(null);
    setLoading(false);
  }, []);

  return { messages, matches, preferences, loading, sendMessage, reset };
}
