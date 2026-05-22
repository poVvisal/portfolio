import React from 'react';
import { Briefcase } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const Experience = () => {
  return (
    <AnimatedSection id="experience">
      <div className="mb-12 text-left">
        <h3 className="text-3xl font-bold mb-4 text-white">Work Experience</h3>
        <p className="max-w-2xl text-slate-400 text-lg">
           A history of roles strengthening my problem-solving, communication, and technical foundations.
        </p>
      </div>

      <div className="relative border-l-2 border-slate-700 ml-4 space-y-12 pb-8 max-w-4xl">
        
        <div className="relative pl-8 md:pl-12">
          <div className="absolute -left-[17px] bg-slate-900 border-4 border-orange-900/50 p-2 rounded-full">
            <Briefcase size={20} className="text-orange-500" />
          </div>
          <div className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
            <span className="inline-block bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-slate-600">2023 - Present</span>
            <h4 className="text-xl font-bold text-white">Food Tour Guide</h4>
            <p className="text-orange-500 font-medium mb-4 text-sm">Urban Forage</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Led cultural food tours for international guests, providing English narratives on Khmer cuisine. Strengthened cross-cultural communication, adaptability, and public speaking skills.
            </p>
          </div>
        </div>

        <div className="relative pl-8 md:pl-12">
           <div className="absolute -left-[17px] bg-slate-900 border-4 border-slate-800 p-2 rounded-full">
            <Briefcase size={20} className="text-slate-500" />
          </div>
          <div className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
            <span className="inline-block bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-slate-600">2022 - 2023</span>
            <h4 className="text-xl font-bold text-white">English Tutor</h4>
            <p className="text-orange-500 font-medium mb-4 text-sm">Phum Yerng Education Center</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Tutored 30 young high school learners. Adapted explanations of fundamental grammar concepts and speaking practices to suit diverse learning speeds.
            </p>
          </div>
        </div>

        <div className="relative pl-8 md:pl-12">
          <div className="absolute -left-[17px] bg-slate-900 border-4 border-slate-800 p-2 rounded-full">
            <Briefcase size={20} className="text-slate-500" />
          </div>
          <div className="bg-slate-800 p-6 md:p-8 rounded-2xl border border-slate-700 shadow-sm hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
            <span className="inline-block bg-slate-700 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full mb-4 border border-slate-600">2021 - 2022</span>
            <h4 className="text-xl font-bold text-white">Technical Support & Event Coordination</h4>
            <p className="text-orange-500 font-medium mb-4 text-sm">Preah Mlou High School</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Provided hands-on technical assistance for school events. Managed projector setup, physical network cabling, and troubleshot connectivity issues on the fly.
            </p>
          </div>
        </div>

      </div>
    </AnimatedSection>
  );
};
