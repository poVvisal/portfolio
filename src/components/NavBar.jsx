import React from 'react';

export const NavBar = () => {
  return (
    <nav className="fixed w-full bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-800 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 font-bold text-xl tracking-tight">
            PV<span className="text-orange-500">S</span>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <a href="#about" className="text-sm font-medium hover:text-orange-500 transition-colors">About</a>
            <a href="#tech" className="text-sm font-medium hover:text-orange-500 transition-colors">Tech Stack</a>
            <a href="#github" className="text-sm font-medium hover:text-orange-500 transition-colors">GitHub</a>
            <a href="#projects" className="text-sm font-medium hover:text-orange-500 transition-colors">Architecture</a>
          </div>
        </div>
      </div>
    </nav>
  );
};
