import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChatPage() {
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isAsking, setIsAsking] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState("");

  // Suggested Questions related to the topics
  const suggestedQuestions = [
    "Who are the Maasai people and what is their culture?",
    "What is unique about the Sami people's way of life?",
    "Tell me about the Ainu people's traditions.",
    "History and lifestyle of Aboriginal Australians?",
    "Key achievements of Mahatma Gandhi?",
    "Major Native American tribes in the United States?",
    "What are the main accomplishments of the Maya civilization?",
    "Who are the Mapuche people?",
    "Facts about the Inca Empire?",
    "History of the Aztec civilization?",
    "Who are the Bhil people?",
    "Culture of the Santal people?",
    "Life and legacy of Nelson Mandela?",
    "What did Mother Teresa contribute to humanity?"
  ];

  useEffect(() => {
    if (session) loadChatHistory();
  }, [session]);

  async function loadChatHistory() {
    setLoadingHistory(true);
    try {
      const res = await fetch("/api/chat-history");
      const data = await res.json();
      if (res.ok && data.messages) setMessages(data.messages);
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setLoadingHistory(false);
    }
  }

  if (status === "loading") return <p>Loading...</p>;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      redirect: false,
      email: form.email,
      password: form.password,
      name: form.name,
    });
    setLoading(false);
    if (result?.error) {
      setError(
        result.error === "CredentialsSignin"
          ? "Invalid email or password. Please try again."
          : "An error occurred during sign in. Please try again."
      );
    } else if (result?.ok) setError("");
  }

  async function handleOAuthSignIn(provider) {
    setError("");
    await signIn(provider, { callbackUrl: "/chat" });
  }

  // ---------------- LOGIN PAGE ---------------- //
  if (!session) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F4E8D3] via-[#EADBC8] to-[#D8C3A5]">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 6 }}
            className="absolute top-10 left-20 w-64 h-64 bg-[#C86C52] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          ></motion.div>
          <motion.div
            animate={{ y: [20, 0, 20], opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 8 }}
            className="absolute bottom-10 right-20 w-72 h-72 bg-[#2F5D50] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          ></motion.div>
        </div>

        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 backdrop-blur-lg bg-white/40 border border-[#C86C52]/40 shadow-2xl rounded-2xl p-10 max-w-md w-full"
        >
          <button
            onClick={() => (window.location.href = "/")}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/50 transition-colors group"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 text-[#2A2A2A] group-hover:text-[#C86C52] transition-colors"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <div className="text-center mb-6">
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: 10 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 3,
              }}
              className="mx-auto w-14 h-14 bg-gradient-to-tr from-[#C86C52] to-[#D8A047] rounded-full shadow-lg"
            ></motion.div>

            <h2 className="text-3xl font-extrabold text-[#2F5D50] mt-4">
              Indigenous Chat
            </h2>
            <p className="text-[#5A4E4A] text-sm mt-2">
              Dive into the wisdom of Indigenous cultures 🌿
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg mb-3 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              required
              placeholder="Full Name"
              className="w-full p-3 rounded-lg border-2 border-[#D8A047]/50 focus:border-[#C86C52] focus:outline-none"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full p-3 rounded-lg border-2 border-[#D8A047]/50 focus:border-[#C86C52] focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              required
              placeholder="Password"
              className="w-full p-3 rounded-lg border-2 border-[#D8A047]/50 focus:border-[#C86C52] focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#C86C52] to-[#D8A047] text-white font-bold py-2 rounded-lg shadow-md"
            >
              {loading ? "Authenticating..." : "Sign In / Register"}
            </motion.button>
          </form>

          <div className="text-center mt-6 text-[#5A4E4A]">
            <p className="text-sm">Or continue with</p>
            <div className="flex justify-center mt-3 gap-3">
              {["github", "google", "twitter"].map((provider) => (
                <motion.button
                  key={provider}
                  whileHover={{ scale: 1.1 }}
                  onClick={() => handleOAuthSignIn(provider)}
                  className="bg-[#3E2C27] hover:bg-[#2F5D50] text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md"
                >
                  {provider.charAt(0).toUpperCase() + provider.slice(1)}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ---------------- CHAT PAGE ---------------- //
  async function handleAskQuestion(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setIsAsking(true);
    const userMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            data.success && data.answer
              ? data.answer
              : data.error || "Sorry, something went wrong.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Network error. Try again later." },
      ]);
    } finally {
      setIsAsking(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4E8D3] via-[#EADBC8] to-[#D8C3A5] flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-[#C86C52]/40 shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#C86C52] to-[#D8A047] shadow-md"></div>
            <div>
              <a href="/">
                <h1 className="text-lg font-bold text-[#2F5D50]">
                  Indigenous Cultures Chatbot
                </h1>
              </a>
              <p className="text-xs text-[#5A4E4A]">
                Welcome, {session.user.name.split(" ")[0]}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setMessages([])}
              className="px-4 py-2 bg-[#D8C3A5] hover:bg-[#C6AD92] text-[#3E2C27] rounded-lg font-semibold"
            >
              Clear
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => signOut()}
              className="px-4 py-2 bg-gradient-to-r from-[#C86C52] to-[#2F5D50] text-white rounded-lg font-semibold"
            >
              Sign Out
            </motion.button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto max-w-4xl mx-auto w-full px-6 py-8 space-y-4">
        {messages.length === 0 && !loadingHistory ? (
          <div className="text-center mt-20 text-[#2F5D50]">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-5xl"
            >
              💬
            </motion.div>
            <p className="text-lg font-semibold mt-2">
              Start a conversation about Indigenous Cultures!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl shadow ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-[#C86C52] to-[#D8A047] text-white"
                    : "bg-white/80 border border-[#C86C52]/30 text-[#3E2C27] backdrop-blur-md"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))
        )}

        {isAsking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-[#C86C52]/40 rounded-lg px-4 py-3 shadow-sm flex gap-2">
              <span className="w-2 h-2 bg-[#C86C52] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#C86C52] rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-[#C86C52] rounded-full animate-bounce delay-300"></span>
            </div>
          </motion.div>
        )}

        {/* Suggested Questions */}
        <div className="max-w-4xl mx-auto px-6 py-2 flex flex-wrap gap-2">
          {suggestedQuestions.map((q, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              onClick={() => setQuestion(q)}
              className="px-3 py-1 bg-[#C86C52]/20 text-[#3E2C27] rounded-full text-sm font-medium hover:bg-[#C86C52]/40 transition-colors"
            >
              {q.length > 30 ? q.slice(0, 30) + "..." : q}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleAskQuestion}
        className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-[#C86C52]/40 p-4"
      >
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask something meaningful..."
            className="flex-1 px-4 py-3 border-2 border-[#D8A047]/50 rounded-xl focus:outline-none focus:border-[#C86C52]"
            disabled={isAsking}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={!question.trim()}
            className="px-6 py-3 bg-gradient-to-r from-[#2F5D50] to-[#C86C52] text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
          >
            {isAsking ? "..." : "Send"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
