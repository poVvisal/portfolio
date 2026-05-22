import React from 'react';
import { Terminal, Download, Sparkles, Mail } from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { AnimatedSection } from './AnimatedSection';

export const Hero = ({ aiPitch, isGeneratingPitch, handleGeneratePitch }) => {
  return (
    <AnimatedSection id="hero" className="text-left pt-10 md:pt-16 pb-6 md:pb-8">
      <p className="text-orange-500 font-semibold tracking-wide uppercase mb-4 flex items-center justify-start gap-2">
        <Terminal size={18} /> Welcome to my portfolio
      </p>
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
        Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Pov Visal</span>
      </h1>
      <h2 className="text-xl md:text-2xl font-medium mb-10 max-w-2xl text-slate-400 leading-relaxed">
        Junior Cloud Infrastructure Engineer | AWS & DevOps Enthusiast
      </h2>
      
      <div className="flex justify-start flex-wrap gap-4 mb-8">
        <a href="#projects" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg">
          View Architecture
        </a>
        <a href="/resume.pdf" download="Pov_Visal_Resume.pdf" className="bg-slate-800 border border-slate-700 text-slate-200 px-6 py-3 rounded-lg font-medium hover:border-orange-500 hover:text-orange-400 transition-colors shadow-sm flex items-center gap-2">
          <Download size={18} /> Download CV
        </a>
        <a href="mailto:P.visal6927@gmail.com" className="bg-slate-800 border border-slate-700 text-slate-200 px-6 py-3 rounded-lg font-medium hover:border-orange-500 transition-colors shadow-sm">
          Contact Me
        </a>
        <button 
          onClick={handleGeneratePitch}
          disabled={isGeneratingPitch}
          className="group flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-800 border border-orange-900/50 text-orange-400 px-6 py-3 rounded-lg font-medium hover:border-orange-500 transition-all shadow-sm disabled:opacity-70"
        >
          {isGeneratingPitch ? (
            <Sparkles size={18} className="animate-spin" />
          ) : (
            <Sparkles size={18} className="group-hover:scale-110 transition-transform text-orange-500" />
          )}
          {isGeneratingPitch ? 'Drafting...' : 'Generate AI Pitch ✨'}
        </button>
      </div>

      {aiPitch && (
        <div className="max-w-2xl mb-10 p-5 bg-slate-800/50 border border-orange-900/30 rounded-xl shadow-sm text-left animate-fade-in-up relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500"></div>
          <p className="text-slate-300 italic text-sm md:text-base pr-4 pl-2 leading-relaxed">
            "{aiPitch}"
          </p>
        </div>
      )}

      <div className="flex justify-start gap-6 mt-6">
        <a href="https://github.com/povvisal" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
          <Github size={24} />
        </a>
        <a href="https://www.linkedin.com/in/visal-pov-891444296/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
          <Linkedin size={24} />
        </a>
        <a href="mailto:P.visal6927@gmail.com" className="text-slate-500 hover:text-orange-500 transition-colors">
          <Mail size={24} />
        </a>
      </div>
    </AnimatedSection>
  );
};
