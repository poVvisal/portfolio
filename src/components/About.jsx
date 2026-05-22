import React from 'react';
import { GraduationCap, Award, ExternalLink } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { awsBadges } from '../data/constants';

export const About = () => {
  return (
    <AnimatedSection id="about">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <h3 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            About Me
          </h3>
          <div className="space-y-4 text-slate-400 text-lg leading-relaxed mb-8">
            <p>
              Hi, I'm Visal! I'm currently a student pursuing a <strong className="text-white">B.S. in Digital Infrastructure</strong> at AUPP, with a heavy focus on all things Cloud. 
            </p>
            <p>
              Rather than just reading about tech, I love getting my hands dirty—whether that's architecting systems from scratch, automating deployments so developers can sleep better, or untangling complex network configs. 
            </p>
            <p>
              My goal is to bridge the gap between development and operations, bringing practical experience in <strong className="text-white">AWS, Linux administration, and CI/CD methodologies</strong> to the table.
            </p>
          </div>
          
          <div className="bg-slate-800/50 rounded-xl p-6 md:p-8 border border-slate-700/50 shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all duration-300 cursor-default inline-block w-full max-w-xl">
            <h4 className="text-xl font-bold mb-3 flex items-center gap-2 text-white">
              <GraduationCap size={20} className="text-orange-500" /> Education
            </h4>
            <p className="font-semibold text-orange-500 text-lg">American University of Phnom Penh (AUPP)</p>
            <p className="text-sm mb-5 text-slate-400">Expected early 2027</p>
            <div className="flex flex-wrap gap-2">
              {['Cloud Architecture', 'Linux Administration', 'Networking', 'Cybersecurity'].map(course => (
                <span key={course} className="text-sm font-mono bg-slate-900/50 text-slate-300 px-3 py-1.5 rounded-md border border-slate-700">
                  {course}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-slate-800/20 rounded-2xl p-6 border border-slate-800 h-full">
            <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
              <Award className="text-orange-500" /> AWS Credentials
            </h3>
            <p className="text-sm text-slate-400 mb-6">Industry-recognized certifications demonstrating hands-on cloud expertise.</p>
            
            <div className="grid grid-cols-2 gap-4">
              {awsBadges.map((badge, idx) => (
                <a 
                  key={idx} 
                  href={badge.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col items-center p-4 bg-slate-800 border border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <img src={badge.imgSrc} alt={`AWS Academy Graduate - ${badge.name}`} className="w-16 h-16 md:w-20 md:h-20 object-contain mb-3 drop-shadow-sm group-hover:drop-shadow-md transition-all" />
                  <span className="text-xs md:text-sm font-semibold text-slate-200">{badge.name}</span>
                  <div className="mt-3 flex items-center text-[10px] md:text-xs text-orange-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Verify <ExternalLink size={12} className="ml-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
