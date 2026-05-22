import React from 'react';
import { AnimatedSection } from './AnimatedSection';
import { techStack } from '../data/constants';

export const TechStack = () => {
  return (
    <AnimatedSection id="tech">
      <div className="text-left mb-10">
        <h3 className="text-3xl font-bold mb-4 text-white">Technical Arsenal</h3>
        <p className="max-w-2xl text-slate-400 text-lg">
          The core technologies and tools I leverage to build, deploy, and scale robust applications.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {techStack.map((category, idx) => (
          <div key={idx} className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
              {React.cloneElement(category.icon, { size: 100 })}
            </div>
            <h4 className="text-xl font-bold mb-6 flex items-center gap-3 text-white relative z-10">
              {category.icon} {category.category}
            </h4>
            <div className="grid grid-cols-2 gap-4 relative z-10">
              {category.items.map((tool, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 hover:bg-slate-700 transition-all duration-300 border border-slate-700/50 hover:border-orange-500/60 hover:shadow-sm cursor-pointer hover:-translate-y-1">
                  {tool.icon ? (
                    <img 
                      src={tool.icon} 
                      alt={tool.name} 
                      className={`w-6 h-6 object-contain ${tool.invertDark ? 'filter invert brightness-0' : ''}`} 
                    />
                  ) : (
                    tool.fallback
                  )}
                  <span className="text-sm font-medium text-slate-300">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
};
