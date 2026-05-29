import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { TechStack } from './components/TechStack';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { ContactForm } from './components/emailjs';
import { GithubStats } from './components/GithubStats';
import { Footer } from './components/Footer';
import { TerminalComponent } from './components/Terminal';
import { CanvasBackground } from './components/CanvasBackground';
import { fetchGeminiResponse } from './utils/gemini';

const App = () => {
  const [aiPitch, setAiPitch] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleGeneratePitch = async () => {
    setIsGeneratingPitch(true);
    const prompt = "Write a creative, 2-sentence elevator pitch for Pov Visal, a Junior Cloud Infrastructure Engineer. Use a futuristic, deep-space theme. Make it punchy. No hashtags.";
    const response = await fetchGeminiResponse(prompt, "You are a hype-AI onboard a starship. Pitch Visal.");
    setAiPitch(response);
    setIsGeneratingPitch(false);
  };

  return (
    <div className="relative min-h-screen bg-[#05070e] text-slate-200 font-sans selection:bg-orange-500 selection:text-white pb-16 overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <CanvasBackground />
        </Canvas>
      </div>

      <NavBar />

      <main className="relative z-10 pt-20 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 md:space-y-24">
        <Hero aiPitch={aiPitch} isGeneratingPitch={isGeneratingPitch} handleGeneratePitch={handleGeneratePitch} />
        <About />
        <TerminalComponent />
        <Experience />
        <Projects />
        <TechStack />
        <ContactForm />
        <GithubStats />
      </main>

      <Footer />
    </div>
  );
};

export default App;