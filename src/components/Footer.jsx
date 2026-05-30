import { useState, useEffect } from 'react';
import { Github, Linkedin } from './Icons';
import { ArrowDownRight, ArrowUpRight, Globe, Users } from 'lucide-react';

const SOURCE_LABELS = {
  direct: 'Direct',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  search: 'Search',
  internal: 'Internal',
  other: 'Other',
};

const SOURCE_STYLES = {
  direct: 'border-slate-700 text-slate-300 bg-slate-800/80',
  github: 'border-slate-700 text-slate-200 bg-slate-800/80',
  linkedin: 'border-slate-700 text-sky-200 bg-slate-800/80',
  search: 'border-slate-700 text-emerald-200 bg-slate-800/80',
  internal: 'border-slate-700 text-orange-200 bg-slate-800/80',
  other: 'border-slate-700 text-slate-200 bg-slate-800/80',
};

function formatCount(value) {
  if (typeof value !== 'number') {
    return '---';
  }

  return new Intl.NumberFormat('en-US').format(value);
}

function formatTrend(changePct) {
  if (changePct === null) {
    return { label: 'new', tone: 'text-orange-300', Icon: Globe };
  }

  if (changePct === 0) {
    return { label: 'flat', tone: 'text-slate-400', Icon: Globe };
  }

  const absolute = Math.abs(changePct);
  const label = `${changePct > 0 ? '+' : '-'}${absolute >= 10 ? absolute.toFixed(0) : absolute.toFixed(1)}%`;

  return {
    label,
    tone: changePct > 0 ? 'text-emerald-300' : 'text-rose-300',
    Icon: changePct > 0 ? ArrowUpRight : ArrowDownRight,
  };
}

function Sparkline({ values }) {
  if (!Array.isArray(values) || values.length < 2) {
    return null;
  }

  const width = 160;
  const height = 42;
  const padding = 3;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const max = Math.max(...values, 1);
  const points = values.map((value, index) => {
    const x = padding + (usableWidth * index) / (values.length - 1);
    const y = padding + usableHeight - (value / max) * usableHeight;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-10 w-full text-orange-400/90" aria-hidden="true">
      <defs>
        <linearGradient id="visits-gradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
        </linearGradient>
      </defs>
      <polyline
        fill="none"
        stroke="url(#visits-gradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export const Footer = () => {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    if (window.__portfolioVisitsTracked) {
      return;
    }

    window.__portfolioVisitsTracked = true;

    fetch('/api/counter', {
      headers: {
        'x-referrer': document.referrer,
      },
    })
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch(() => setMetrics({ total: 'Err', weekly: { changePct: null }, monthly: { changePct: null }, sparkline: [], referrers: [] }));
  }, []);

  const weeklyTrend = formatTrend(metrics?.weekly?.changePct ?? null);
  const monthlyTrend = formatTrend(metrics?.monthly?.changePct ?? null);

  return (
    <footer className="relative z-10 mt-16 border-t border-slate-800 pt-4 pb-4 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="text-slate-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Pov Visal. Built with React & Tailwind.
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300 shadow-sm hover:border-orange-500/50 transition-colors cursor-default">
              <Users size={14} className="text-orange-500" />
              <span>Total: <strong className="text-white">{formatCount(typeof metrics?.total === 'number' ? metrics.total : null)}</strong></span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300 shadow-sm cursor-default">
              <span>7d: <strong className="text-white">{formatCount(metrics?.weekly?.current)}</strong></span>
              <span className={weeklyTrend.tone}>
                <weeklyTrend.Icon size={14} className="inline-block align-[-2px]" /> {weeklyTrend.label}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-mono text-slate-300 shadow-sm cursor-default">
              <span>30d: <strong className="text-white">{formatCount(metrics?.monthly?.current)}</strong></span>
              <span className={monthlyTrend.tone}>
                <monthlyTrend.Icon size={14} className="inline-block align-[-2px]" /> {monthlyTrend.label}
              </span>
            </div>
          </div>

          <div className="flex space-x-6 text-slate-500 self-center md:self-auto">
            <a href="https://github.com/povvisal" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="https://www.linkedin.com/in/visal-pov-891444296/" target="_blank" rel="noreferrer" className="hover:text-blue-400 transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.2)]">
            <div className="flex items-center justify-between gap-4 mb-2">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Visit trend</p>
                <p className="text-sm text-slate-300">Last 14 days</p>
              </div>
              <div className="text-right text-xs text-slate-500">
                <div>{metrics ? 'Live' : 'Loading'}</div>
                <div>{metrics?.referrers?.length ? `${metrics.referrers.length} sources` : 'No source data yet'}</div>
              </div>
            </div>
            <Sparkline values={metrics?.sparkline ?? []} />
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 mb-3">Referrers</p>
            <div className="flex flex-wrap gap-2">
              {(metrics?.referrers ?? []).length ? metrics.referrers.map(({ source, count }) => (
                <span
                  key={source}
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-mono ${SOURCE_STYLES[source] ?? SOURCE_STYLES.other}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                  <span>{SOURCE_LABELS[source] ?? source}</span>
                  <strong className="text-white">{formatCount(count)}</strong>
                </span>
              )) : (
                <span className="text-sm text-slate-500">No referrer data yet.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
