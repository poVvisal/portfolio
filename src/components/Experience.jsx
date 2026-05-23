import React, { useEffect } from 'react';
import { Briefcase } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const Experience = () => {
  useEffect(() => {
    const section = document.getElementById('experience');

    if (!section) {
      return undefined;
    }

    let frameId = 0;

    const updateRailProgress = () => {
      frameId = 0;

      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const totalTravel = viewportHeight + rect.height;
      const rawProgress = (viewportHeight - rect.top) / totalTravel;
      const progress = Math.max(0, Math.min(1, Math.pow(Math.max(rawProgress, 0), 0.78)));

      section.style.setProperty('--experience-progress', progress.toFixed(4));
    };

    const requestProgressUpdate = () => {
      if (frameId) {
        return;
      }

      frameId = window.requestAnimationFrame(updateRailProgress);
    };

    updateRailProgress();
    window.addEventListener('scroll', requestProgressUpdate, { passive: true });
    window.addEventListener('resize', requestProgressUpdate);

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      window.removeEventListener('scroll', requestProgressUpdate);
      window.removeEventListener('resize', requestProgressUpdate);
    };
  }, []);

  return (
    <AnimatedSection id="experience">
      <div className="mb-12 text-left">
        <h3 className="text-3xl font-bold mb-4 text-white">Work Experience</h3>
        <p className="max-w-2xl text-slate-400 text-lg">
           A history of roles strengthening my problem-solving, communication, and technical foundations.
        </p>
      </div>

      <div className="experience-timeline relative ml-4 max-w-4xl space-y-12 pb-8 pl-8 md:pl-12">
        <div aria-hidden="true" className="experience-timeline__rail">
          <span className="experience-timeline__track" />
          <span className="experience-timeline__fill" />
          <span className="experience-timeline__scan" />
          <span className="experience-timeline__orb experience-timeline__orb--one" />
          <span className="experience-timeline__orb experience-timeline__orb--two" />
          <span className="experience-timeline__orb experience-timeline__orb--three" />
        </div>

        <div className="relative">
          <div className="absolute -left-[26px] md:-left-[30px] top-1 bg-slate-900 border-[5px] border-orange-500/35 p-2 rounded-full shadow-[0_0_24px_rgba(249,115,22,0.35)] ring-4 ring-orange-500/10 animate-pulse">
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

          <div className="relative">
            <div className="absolute -left-[26px] md:-left-[30px] top-1 bg-slate-900 border-[5px] border-slate-700 p-2 rounded-full shadow-[0_0_18px_rgba(71,85,105,0.25)]">
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

        <div className="relative">
          <div className="absolute -left-[26px] md:-left-[30px] top-1 bg-slate-900 border-[5px] border-slate-700 p-2 rounded-full shadow-[0_0_18px_rgba(71,85,105,0.25)]">
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
