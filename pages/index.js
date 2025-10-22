// app/page.tsx or pages/index.js
export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#F4E8D3] to-[#F0D8B5] text-[#2A2A2A] font-sans flex flex-col items-center justify-center px-6">
      
      {/* Background Pattern (Faint Tribal Art) */}
      <div
        className="absolute inset-0 opacity-10 bg-repeat bg-center"
        style={{
          backgroundImage:
            "url('/tribal-pattern.png')",
        }}
      ></div>

      {/* Hero Section */}
      <section className="relative text-center max-w-3xl mt-20 z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-[#2F5D50] drop-shadow-sm">
          Indigenous Cultures <span className="text-[#C86C52]">RAG Chatbot</span>
        </h1>
        <p className="mt-6 text-lg text-[#5A4E4A] leading-relaxed">
          Explore the wisdom and traditions of indigenous communities through an interactive
          AI-powered chatbot that blends technology with cultural storytelling.
        </p>

        <a href="/chat">
          <button className="mt-10 px-8 py-3 bg-[#C86C52] text-white rounded-2xl text-lg font-semibold shadow-md hover:bg-[#A6543E] hover:scale-105 transition duration-300">
            Start Chatting →
          </button>
        </a>
      </section>

      {/* Divider */}
      <div className="relative w-24 h-1 bg-[#D8A047] my-16 rounded-full z-10"></div>

      {/* About Section */}
      <section className="relative max-w-4xl text-center space-y-6 z-10">
        <h2 className="text-3xl font-semibold text-[#3B4D91]">
          Celebrating Cultural Heritage
        </h2>
        <p className="text-[#5A4E4A] text-lg leading-relaxed">
          This chatbot celebrates the diversity of indigenous cultures — their art, 
          languages, and ecological wisdom. Dive into centuries of heritage, 
          expressed through stories, crafts, and sustainable traditions.
        </p>
      </section>

      {/* Footer */}
      <footer className="relative mt-24 w-full bg-[#2F5D50] text-[#F4E8D3] py-6 text-center z-10">
        <p className="text-sm">
          © {new Date().getFullYear()} Indigenous Cultures RAG Chatbot. 
          Crafted with respect for heritage and innovation.
        </p>
      </footer>
    </div>
  );
}
