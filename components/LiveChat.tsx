"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Send, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

// This is a placeholder component for live chat
// In production, integrate with a service like StreamChat, Twitch Chat, or custom WebSocket
export default function LiveChat() {
  const [isLive, setIsLive] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; user: string; text: string; time: Date }>>([]);
  const [newMessage, setNewMessage] = useState("");
  const { t } = useI18n();

  // Check if stream is live
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const response = await fetch("/api/stream-status");
        const status = await response.json();
        setIsLive(status.isLive);
      } catch (error) {
        setIsLive(false);
      }
    };

    checkLiveStatus();
    const interval = setInterval(checkLiveStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !isLive) return;

    // In production, send to your chat service
    const message = {
      id: Date.now().toString(),
      user: "You", // Replace with actual user
      text: newMessage,
      time: new Date(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  if (!isLive) {
    return (
      <div className="glass rounded-lg p-6 text-center">
        <MessageCircle className="w-8 h-8 text-ministry-gold/50 mx-auto mb-2" />
        <p className="text-foreground/60 text-sm">
          {t("liveChat.offline")}
        </p>
        <p className="text-foreground/40 text-xs mt-1">{t("liveChat.offlineSub")}</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg flex flex-col h-[300px] md:h-[400px]" data-chat>
      {/* Header */}
      <div className="p-4 border-b border-ministry-gold/20">
        <h3 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-ministry-gold" />
          {t("liveChat.header")}
        </h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {messages.length === 0 ? (
            <p className="text-foreground/40 text-sm text-center py-8">
              {t("liveChat.empty")}
            </p>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm"
              >
                <span className="text-ministry-gold font-medium">
                  {message.user}:
                </span>{" "}
                <span className="text-foreground/90">{message.text}</span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-ministry-gold/20 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type a message..."
          placeholder={t("liveChat.placeholder")}
          className="flex-1 bg-foreground/5 border border-ministry-gold/30 rounded-md px-3 py-2 text-foreground placeholder-foreground/40 focus:outline-none focus:border-ministry-gold"
        />
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-ministry-gold hover:bg-ministry-gold/80 text-ministry-dark rounded-md transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

