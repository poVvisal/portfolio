import React from 'react';
import { Github, Linkedin } from './Icons';

export const Footer = () => {
  return (
    <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-slate-800 pt-4 pb-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm font-medium">
          &copy; {new Date().getFullYear()} Pov Visal. Built with React & Tailwind.
        </p>
        <div className="flex space-x-6 text-slate-500">
          <a href="https://github.com/povvisal" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
            <Github size={20} />
          </a>
          <a href="#" className="hover:text-blue-400 transition-colors">
            <Linkedin size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};
