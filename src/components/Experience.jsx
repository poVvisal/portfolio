import React, { useEffect, useRef, useState } from 'react';
import { Briefcase } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

const experienceItems = [
  {
    year: '2023 - Present',
    title: 'Food Tour Guide',
    company: 'Urban Forage',
    description:
      'Led cultural food tours for international guests, providing English narratives on Khmer cuisine. Strengthened cross-cultural communication, adaptability, and public speaking skills.',
    iconClassName: 'text-orange-500',
    iconWrapperClassName:
      'bg-slate-900 border-orange-500/35 shadow-[0_0_24px_rgba(249,115,22,0.35)] ring-4 ring-orange-500/10 animate-pulse',
    badgeClassName: 'bg-slate-700 text-slate-300 border-slate-600',
    titleClassName: 'text-white',
    companyClassName: 'text-orange-500',
  },
  {
    year: '2022 - 2023',
    title: 'English Tutor',
    company: 'Phum Yerng Education Center',
    description:
      'Tutored 30 young high school learners. Adapted explanations of fundamental grammar concepts and speaking practices to suit diverse learning speeds.',
    iconClassName: 'text-slate-500',
    iconWrapperClassName: 'bg-slate-900 border-slate-700 shadow-[0_0_18px_rgba(71,85,105,0.25)]',
    badgeClassName: 'bg-slate-700 text-slate-300 border-slate-600',
    titleClassName: 'text-white',
    companyClassName: 'text-orange-500',
  },
  {
    year: '2021 - 2022',
    title: 'Technical Support & Event Coordination',
    company: 'Preah Mlou High School',
    description:
      'Provided hands-on technical assistance for school events. Managed projector setup, physical network cabling, and troubleshot connectivity issues on the fly.',
    iconClassName: 'text-slate-500',
    iconWrapperClassName: 'bg-slate-900 border-slate-700 shadow-[0_0_18px_rgba(71,85,105,0.25)]',
    badgeClassName: 'bg-slate-700 text-slate-300 border-slate-600',
    titleClassName: 'text-white',
    companyClassName: 'text-orange-500',
  },
];

export const Experience = () => {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const [activeCards, setActiveCards] = useState(() => experienceItems.map(() => false));

  useEffect(() => {
    const section = sectionRef.current || document.getElementById('experience');

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

      const meteorY = rect.top + rect.height * progress;
      const nextActiveCards = cardRefs.current.map((card) => {
        if (!card) {
          return false;
        }

        const cardRect = card.getBoundingClientRect();
        return meteorY >= cardRect.top + cardRect.height * 0.32;
      });

      setActiveCards((currentCards) => {
        const hasChanged = currentCards.some((isActive, index) => isActive !== nextActiveCards[index]);
        return hasChanged ? nextActiveCards : currentCards;
      });
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
    <AnimatedSection id="experience" ref={sectionRef}>
      <div className="mb-12 text-left">
        <h3 className="text-3xl font-bold mb-4 text-white">Work Experience</h3>
        <p className="max-w-2xl text-slate-400 text-lg">
           A history of roles strengthening my problem-solving, communication, and technical foundations.
        </p>
      </div>

      <div className="experience-timeline relative ml-4 max-w-4xl space-y-12 pb-8 pl-14 md:pl-24">
        <div aria-hidden="true" className="experience-timeline__rail">
          <span className="experience-timeline__track" />
          <span className="experience-timeline__fill" />
          <img
            src="/meteorite-head.png"
            alt="Falling Meteorite"
            className="experience-timeline__scan"
          />
        </div>

        {experienceItems.map((item, index) => {
          const isActive = activeCards[index];

          return (
            <div
              key={item.year}
              ref={(node) => {
                cardRefs.current[index] = node;
              }}
              className={`experience-card relative ${isActive ? 'experience-card--active' : ''}`}
            >
              <div
                className={`absolute -left-[42px] md:-left-[46px] top-1 border-[5px] p-2 rounded-full transition-all duration-500 ${item.iconWrapperClassName} ${isActive ? 'experience-card__marker--active' : ''}`}
              >
                <Briefcase size={20} className={item.iconClassName} />
              </div>
              <div className="experience-card__panel group relative bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm transition-all duration-500 hover:border-orange-500/50 hover:shadow-md">
                <div className="absolute inset-0 z-0">
                  <img
                    src="/experience-bg.png"
                    alt="Cloud Tech Background"
                    className={`w-full h-full object-cover mix-blend-screen transition-all duration-700 pointer-events-none ${isActive ? 'opacity-60' : 'opacity-25'} group-hover:opacity-85 group-hover:scale-105`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-800/30 pointer-events-none" />
                </div>

                <div className="relative z-10 p-6 md:p-8">
                  <span className={`inline-block text-xs font-bold px-3 py-1.5 rounded-full mb-4 border ${item.badgeClassName}`}>
                    {item.year}
                  </span>
                  <h4 className={`text-xl font-bold ${item.titleClassName}`}>{item.title}</h4>
                  <p className={`font-medium mb-4 text-sm ${item.companyClassName}`}>{item.company}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          );
        })}

      </div>
    </AnimatedSection>
  );
};
