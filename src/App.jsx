import { useState, useEffect } from 'react';
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
import { fetchGeminiResponse } from './utils/gemini';


const App = () => {
  const [aiPitch, setAiPitch] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGeneratePitch = async () => {
    setIsGeneratingPitch(true);
    const prompt = "Write a creative, 2-sentence elevator pitch for Pov Visal, a Junior Cloud Infrastructure Engineer specializing in AWS, Docker, and CI/CD pipelines. Make it punchy, highly professional, and different every time. Do not use hashtags.";
    const response = await fetchGeminiResponse(prompt, "You are an expert tech recruiter and hype-person for Pov Visal.");
    setAiPitch(response);
    setIsGeneratingPitch(false);
  };

  return (
    <div className="relative min-h-screen bg-slate-900 text-slate-200 transition-colors duration-300 font-sans selection:bg-orange-500 selection:text-white pb-16 overflow-hidden">
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(249, 115, 22, 0.06), transparent 40%)`
        }}
      />

      <NavBar />

      <main className="relative z-10 pt-20 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 md:space-y-24">
        <Hero aiPitch={aiPitch} isGeneratingPitch={isGeneratingPitch} handleGeneratePitch={handleGeneratePitch} />
        <About />
        <TerminalComponent />
        <Projects />
        <Experience />
        <TechStack />
        <ContactForm />
        <GithubStats />
      </main>

      <Footer />
    </div>
  );
};

export default App;