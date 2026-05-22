import React from 'react';
import { Github } from './Icons';
import { AnimatedSection } from './AnimatedSection';

export const GithubStats = () => {
  return (
    <AnimatedSection id="github">
      <div className="text-left mb-10">
        <h3 className="text-3xl font-bold mb-4 flex items-center justify-start gap-3 text-white">
          <Github className="text-orange-500" size={32} /> Code & Contributions
        </h3>
        <p className="max-w-2xl text-slate-400 text-lg">
          A live look into my open-source activity and daily coding habits.
        </p>
      </div>

      <div className="max-w-5xl space-y-6">
        <div className="p-6 bg-[#1a1b26] rounded-2xl shadow-sm border border-slate-700 overflow-hidden hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
          <h4 className="text-sm font-bold text-slate-400 mb-6 px-2 tracking-wide uppercase">Contribution Calendar</h4>
          <div className="bg-slate-900/50 rounded-xl p-4 overflow-x-auto border border-slate-800 flex justify-start">
             <img src="https://ghchart.rshah.org/ea580c/poVvisal" alt="GitHub Contributions Chart" className="min-w-[600px] max-w-full" />
          </div>
        </div>

        <div className="p-6 bg-[#1a1b26] rounded-2xl shadow-sm border border-slate-700 overflow-hidden hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
           <h4 className="text-sm font-bold text-slate-400 mb-6 px-2 tracking-wide uppercase">Contribution Snake</h4>
           <img 
              src="https://raw.githubusercontent.com/poVvisal/poVvisal/output/github-snake-dark.svg"
              alt="GitHub Snake Animation" 
              className="w-full object-contain mix-blend-normal opacity-90 hover:opacity-100 transition-opacity"
           />
        </div>
      </div>
    </AnimatedSection>
  );
};
