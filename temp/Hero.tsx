import React from "react";

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => (
  <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
    <h1 className="text-5xl font-bold mb-4 text-gray-800">SyncPad AI</h1>
    <p className="text-xl mb-8 text-gray-600 max-w-xl text-center">
      Your intelligent, collaborative text editor powered by AI. Summarize, enhance, and explain your notes with a click!
    </p>
    <button
      onClick={onStart}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
    >
      Let&apos;s go to editor
    </button>
  </section>
);

export default Hero;