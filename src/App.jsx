import React, { useState, useEffect, useRef } from 'react';
import { 
  Moon, Sun, Mail, ChevronDown, ChevronUp, 
  Briefcase, GraduationCap, Award, ExternalLink, Database, Server, Code, Terminal, SquareTerminal, Sparkles
} from 'lucide-react';

const Github = ({ size = 24, className = "" }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" className={className}>
    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={props.size || 24} height={props.size || 24} {...props}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const apiKey = ""; // Automatically provided by the execution environment

const fetchGeminiResponse = async (prompt, systemInstruction) => {
  let delay = 1000;
  for (let i = 0; i < 4; i++) {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] }
        })
      });
      if (!response.ok) throw new Error('API Error');
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Error processing request.";
    } catch (err) {
      if (i === 3) return "Connection error to the AI backend. Please try again later.";
      await new Promise(r => setTimeout(r, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  
  // AI Pitch State
  const [aiPitch, setAiPitch] = useState('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);

  // Terminal State
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { command: '', output: 'Welcome to PV-SH v1.0.0.\nType "help" to see available commands.' }
  ]);
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleGeneratePitch = async () => {
    setIsGeneratingPitch(true);
    const prompt = "Write a creative, 2-sentence elevator pitch for Pov Visal, a Junior Cloud Infrastructure Engineer specializing in AWS, Docker, and CI/CD pipelines. Make it punchy, highly professional, and different every time. Do not use hashtags.";
    const response = await fetchGeminiResponse(prompt, "You are an expert tech recruiter and hype-person for Pov Visal.");
    setAiPitch(response);
    setIsGeneratingPitch(false);
  };

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const rawInput = terminalInput.trim();
    const cmd = rawInput.toLowerCase();
    
    if (cmd.startsWith('ask ') || cmd.startsWith('ask ✨')) {
      const query = rawInput.replace(/^ask ✨?\s*/i, '');
      const currentInput = terminalInput; 
      setTerminalInput('');
      setTerminalHistory(prev => [
        ...prev, 
        { command: `visal@portfolio:~$ ${currentInput}`, output: '✨ Consulting the cloud oracle...' }
      ]);

      const sysPrompt = "You are a helpful AI assistant built directly into Pov Visal's interactive portfolio terminal. You must keep your answers concise, technical but friendly, and strictly plain text suitable for a Linux CLI (NO markdown, bolding, or lists). Answer the user's query.";
      const reply = await fetchGeminiResponse(query, sysPrompt);

      setTerminalHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].output = reply;
        return newHistory;
      });
      return;
    }

    let output = '';

    switch (cmd) {
      case 'help':
        output = 'Available commands:\n  help          - Show this message\n  whoami        - Display current user\n  cat about.txt - Read bio summary\n  cat skills.sh - View tech stack\n  aws s3 ls     - List AWS buckets\n  get resume    - Download my resume (PDF)\n  ask [query]   - Ask the AI a question ✨\n  clear         - Clear terminal window';
        break;
      case 'whoami':
        output = 'povvisal - Junior Cloud Infrastructure Engineer';
        break;
      case 'cat about.txt':
        output = 'I am a Cloud Infrastructure student at AUPP specializing in AWS, Linux, and CI/CD pipelines.';
        break;
      case 'cat skills.sh':
        output = '#!/bin/bash\necho "AWS, Terraform, Docker, Jenkins, Linux, Python, Go"';
        break;
      case 'aws s3 ls':
        output = '2026-05-21 15:43:00 portfolio-assets-prod\n2026-05-21 15:43:00 terraform-state-bucket-xyz';
        break;
      case 'get resume':
      case 'wget resume.pdf':
        output = 'Resolving host...\nConnecting to server... connected.\nHTTP request sent, awaiting response... 200 OK\nSaving to: ‘resume.pdf’\n\nDownload triggered successfully!';
        const link = document.createElement('a');
        link.href = '/resume.pdf'; 
        link.download = 'Pov_Visal_Resume.pdf';
        link.click();
        break;
      case 'clear':
        setTerminalHistory([]);
        setTerminalInput('');
        return;
      case 'sudo rm -rf /':
        output = 'bash: sudo: permission denied. Nice try though!';
        break;
      default:
        output = `bash: ${cmd}: command not found. Type "help" for a list of commands.`;
    }

    setTerminalHistory([...terminalHistory, { command: `visal@portfolio:~$ ${terminalInput}`, output }]);
    setTerminalInput('');
  };

  // Toggle Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const awsBadges = [
    { name: "Cloud Architecting", url: "https://www.credly.com/badges/9f7e4185-d2cf-4b4e-a4de-a7988121e425/public_url", imgSrc: "https://images.credly.com/images/fcafd0c9-42da-4703-a191-0c397203dc1b/blob" },
    { name: "Cloud Developing", url: "https://www.credly.com/badges/51b44bfe-0e50-44d5-873d-5e77e61ff798/public_url", imgSrc: "https://images.credly.com/images/bb3211c0-a562-44ec-a8b5-df54deb0e5e9/blob" },
    { name: "Cloud Operations", url: "https://www.credly.com/badges/3e1efe88-99a5-48a2-bb3d-d8d1add751cd/public_url", imgSrc: "https://images.credly.com/images/07e7ba52-aea4-431f-ba2d-a4113efd1d5a/blob" },
    { name: "Cloud Foundations", url: "https://www.credly.com/badges/0e0a0aa8-9668-4a96-a62d-574a8bccaa3f/public_url", imgSrc: "https://images.credly.com/images/e3541a0c-dd4a-4820-8052-5001006efc85/blob" }
  ];

  const techStack = [
    {
      category: "Backend",
      icon: <Code size={20} className="text-blue-500" />,
      items: [
        { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" },
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
        { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", invertDark: true },
        { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg", invertDark: true },
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" }
      ]
    },
    {
      category: "Databases & ORMs",
      icon: <Database size={20} className="text-emerald-500" />,
      items: [
        { name: "PostgreSQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg" },
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" },
        { name: "MySQL", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg" },
        { name: "SQLite", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" },
        { name: "Drizzle", fallback: <Database size={24} className="text-slate-500" /> }
      ]
    },
    {
      category: "Cloud & Infrastructure",
      icon: <Server size={20} className="text-orange-500" />,
      items: [
        { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", invertDark: true },
        { name: "Cloudflare", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg" },
        { name: "Railway", fallback: <Server size={24} className="text-slate-500" /> },
        { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
        { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg" },
        { name: "Bash", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg", invertDark: true }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-300 font-sans selection:bg-orange-500 selection:text-white pb-16">
      
      <nav className="fixed w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-200 dark:border-slate-800 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 font-bold text-xl tracking-tight">
              PV<span className="text-orange-600 dark:text-orange-500">.</span>
            </div>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#about" className="text-sm font-medium hover:text-orange-500 transition-colors">About</a>
              <a href="#tech" className="text-sm font-medium hover:text-orange-500 transition-colors">Tech Stack</a>
              <a href="#github" className="text-sm font-medium hover:text-orange-500 transition-colors">GitHub</a>
              <a href="#projects" className="text-sm font-medium hover:text-orange-500 transition-colors">Architecture</a>
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 md:pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 md:space-y-16">
        
        <section id="hero" className="text-center pt-10 md:pt-16 pb-6 md:pb-8 animate-fade-in-up">
          <p className="text-orange-600 dark:text-orange-500 font-semibold tracking-wide uppercase mb-3 flex items-center justify-center gap-2">
            <Terminal size={18} /> Welcome to my portfolio
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-slate-900 dark:text-white">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Pov Visal</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-8 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
            Junior Cloud Infrastructure Engineer | AWS & DevOps Enthusiast
          </h2>
          
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            <a href="#projects" className="bg-slate-900 dark:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-orange-700 transition-colors shadow-lg">
              View Architecture
            </a>
            <a href="mailto:P.visal6927@gmail.com" className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-3 rounded-lg font-medium hover:border-orange-500 dark:hover:border-orange-500 transition-colors shadow-sm">
              Contact Me
            </a>
            <button 
              onClick={handleGeneratePitch}
              disabled={isGeneratingPitch}
              className="group flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-slate-800 dark:to-slate-800 border border-orange-200 dark:border-orange-900/50 text-orange-700 dark:text-orange-400 px-6 py-3 rounded-lg font-medium hover:border-orange-400 dark:hover:border-orange-500 transition-all shadow-sm disabled:opacity-70"
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
            <div className="max-w-2xl mx-auto mb-10 p-4 bg-white dark:bg-slate-800/50 border border-orange-200 dark:border-orange-900/30 rounded-xl shadow-sm text-left animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500"></div>
              <p className="text-slate-700 dark:text-slate-300 italic text-sm md:text-base pr-4 pl-2">
                "{aiPitch}"
              </p>
            </div>
          )}

          <div className="flex justify-center gap-6 mt-4">
            <a href="https://github.com/povvisal" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
              <Github size={24} />
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:P.visal6927@gmail.com" className="text-slate-500 hover:text-orange-500 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </section>

        <section id="about" className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">About Me</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              I am a driven student pursuing a <strong className="text-slate-900 dark:text-white">B.S. in Digital Infrastructure</strong> with a major in <strong className="text-slate-900 dark:text-white">Cloud Infrastructure</strong>. I specialize in architecting robust systems, automating deployments, and diagnosing complex network configurations. I bridge the gap between development and operations through hands-on experience in AWS, Linux administration, and CI/CD methodologies.
            </p>
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300 cursor-default">
              <h4 className="text-xl font-bold mb-2 flex items-center gap-2 text-slate-900 dark:text-white">
                <GraduationCap size={20} className="text-orange-500" /> Education
              </h4>
              <p className="font-semibold text-orange-600 dark:text-orange-500">American University of Phnom Penh (AUPP)</p>
              <p className="text-sm mb-4 text-slate-500 dark:text-slate-400">Expected early 2027</p>
              <div className="flex flex-wrap gap-2">
                {["Cloud Architecture", "Linux Administration", "Networking", "Cybersecurity"].map(course => (
                  <span key={course} className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="text-orange-500" /> AWS Academy Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {awsBadges.map((badge, idx) => (
                <a 
                  key={idx} 
                  href={badge.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="group flex flex-col items-center p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:-translate-y-1 text-center"
                >
                  <img src={badge.imgSrc} alt={`AWS Academy Graduate - ${badge.name}`} className="w-28 h-28 object-contain mb-3 drop-shadow-sm group-hover:drop-shadow-md transition-all" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{badge.name}</span>
                  <div className="mt-3 flex items-center text-xs text-orange-600 dark:text-orange-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Verify Badge <ExternalLink size={14} className="ml-1" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="cli" className="max-w-5xl mx-auto w-full">
          <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-700 hover:border-orange-500/50 transition-colors duration-300 font-mono text-sm">
            <div className="bg-slate-800 px-4 py-2 flex items-center gap-2 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mx-auto text-slate-400 text-xs flex items-center gap-2 font-sans">
                <SquareTerminal size={14} /> visal@portfolio: ~
              </div>
            </div>
            
            <div className="p-4 h-64 overflow-y-auto bg-slate-950 text-slate-300 flex flex-col gap-2">
              {terminalHistory.map((item, idx) => (
                <div key={idx}>
                  {item.command && (
                    <div className="text-orange-400">
                      {item.command}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-emerald-400">{item.output}</div>
                </div>
              ))}
              <div ref={terminalEndRef} />
              
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 mt-2">
                <span className="text-orange-400 shrink-0">visal@portfolio:~$</span>
                <input 
                  type="text" 
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  className="bg-transparent border-none outline-none flex-1 text-slate-200 w-full"
                  autoComplete="off"
                  autoFocus
                  spellCheck="false"
                />
              </form>
            </div>
          </div>
        </section>

        <section id="tech">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Technical Arsenal</h3>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
              The core technologies and tools I leverage to build, deploy, and scale robust applications.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((category, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
                <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
                  {category.icon} {category.category}
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {category.items.map((tool, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-orange-50 dark:hover:bg-slate-700 transition-all duration-300 border border-transparent hover:border-orange-400/60 dark:hover:border-orange-500/60 hover:shadow-sm cursor-pointer hover:-translate-y-0.5">
                      {tool.icon ? (
                        <img 
                          src={tool.icon} 
                          alt={tool.name} 
                          className={`w-6 h-6 object-contain ${tool.invertDark && isDarkMode ? 'filter invert brightness-0' : ''}`} 
                        />
                      ) : (
                        tool.fallback
                      )}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{tool.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="projects">
          <div className="mb-10 text-center">
            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Featured Architecture</h3>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
              Interactive breakdown of my core infrastructure project, demonstrating DevSecOps, IaC, and Containerization.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                <div>
                  <span className="text-orange-600 dark:text-orange-500 text-sm font-mono font-bold tracking-wider uppercase mb-2 block">Enterprise Deployment Strategy</span>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">CI/CD Pipeline for Containerised Web App on AWS</h4>
                </div>
                <div className="flex gap-3">
                   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className={`w-10 h-10 object-contain ${isDarkMode ? 'filter invert brightness-0' : ''}`} />
                   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" className="w-10 h-10 object-contain" />
                </div>
              </div>
              
              <p className="text-slate-600 dark:text-slate-300 mb-8 text-lg">
                An end-to-end automated deployment pipeline integrating security scans, infrastructure as code, and container orchestration to deliver a highly available web application on Amazon Web Services.
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {["Jenkins", "SonarQube", "Trivy", "Terraform", "AWS S3 & DynamoDB"].map(tag => (
                  <span key={tag} className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 text-sm rounded-full font-mono border border-slate-200 dark:border-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => setIsProjectExpanded(!isProjectExpanded)} 
                className="flex items-center gap-2 text-orange-600 dark:text-orange-500 hover:text-orange-700 dark:hover:text-orange-400 transition-colors font-semibold focus:outline-none bg-orange-50 dark:bg-orange-500/10 px-4 py-2 rounded-lg"
              >
                {isProjectExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />} 
                {isProjectExpanded ? 'Hide Architecture Details' : 'Explore Architecture Details'}
              </button>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${isProjectExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="bg-slate-50 dark:bg-slate-900/50 p-8 md:p-10 border-t border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h5 className="font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <Terminal size={18} className="text-orange-500" /> Automated DevSecOps
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Jenkins pipeline triggered on main pushes. Integrates SonarQube quality gates for code analysis and Trivy security scans for both source code and container images, ensuring secure deployments.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <Server size={18} className="text-orange-500" /> Secure IaC
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Utilized Terraform to provision least-privilege EC2 instances. Implemented remote state management and state locking utilizing AWS S3 and DynamoDB to prevent configuration drift.
                    </p>
                  </div>
                  <div>
                    <h5 className="font-bold mb-3 flex items-center gap-2 text-slate-900 dark:text-white">
                      <Database size={18} className="text-orange-500" /> Dockerized Deployment
                    </h5>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Automates the build process and DockerHub push. Executes multi-node deployments with verified SSH readiness checks and automated HTTP health checks post-deployment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="experience">
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold mb-4 text-slate-900 dark:text-white">Work Experience</h3>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
               A history of roles strengthening my problem-solving, communication, and technical foundations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto relative border-l border-slate-200 dark:border-slate-700 ml-4 md:ml-auto space-y-12 pb-8">
            
            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-5 bg-white dark:bg-slate-900 border-4 border-orange-100 dark:border-orange-900/30 p-2 rounded-full">
                <Briefcase size={20} className="text-orange-500" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
                <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full mb-3">2023 - Present</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">Food Tour Guide</h4>
                <p className="text-orange-600 dark:text-orange-500 font-medium mb-3 text-sm">Urban Forage</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Led cultural food tours for international guests, providing English narratives on Khmer cuisine. Strengthened cross-cultural communication, adaptability, and public speaking skills.
                </p>
              </div>
            </div>

            <div className="relative pl-8 md:pl-10">
               <div className="absolute -left-5 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 p-2 rounded-full">
                <Briefcase size={20} className="text-slate-400" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
                <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full mb-3">2022 - 2023</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">English Tutor</h4>
                <p className="text-orange-600 dark:text-orange-500 font-medium mb-3 text-sm">Phum Yerng Education Center</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Tutored 30 young high school learners. Adapted explanations of fundamental grammar concepts and speaking practices to suit diverse learning speeds.
                </p>
              </div>
            </div>

            <div className="relative pl-8 md:pl-10">
              <div className="absolute -left-5 bg-white dark:bg-slate-900 border-4 border-slate-100 dark:border-slate-800 p-2 rounded-full">
                <Briefcase size={20} className="text-slate-400" />
              </div>
              <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
                <span className="inline-block bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-bold px-3 py-1 rounded-full mb-3">2021 - 2022</span>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">Technical Support & Event Coordination</h4>
                <p className="text-orange-600 dark:text-orange-500 font-medium mb-3 text-sm">Preah Mlou High School</p>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  Provided hands-on technical assistance for school events. Managed projector setup, physical network cabling, and troubleshot connectivity issues on the fly.
                </p>
              </div>
            </div>

          </div>
        </section>

        <section id="github">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3 text-slate-900 dark:text-white">
              <Github className="text-orange-500" size={32} /> Code & Contributions
            </h3>
            <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
              A live look into my open-source activity and daily coding habits.
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            <div className="p-4 bg-white dark:bg-[#1a1b26] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
              <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 px-2">Contribution Calendar</h4>
              <div className="bg-white rounded-xl p-2 overflow-x-auto border border-slate-100 dark:border-slate-800 flex justify-center">
                 <img src="https://ghchart.rshah.org/ea580c/poVvisal" alt="GitHub Contributions Chart" className="min-w-[600px] max-w-full" />
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#1a1b26] rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:border-orange-400/50 dark:hover:border-orange-500/50 hover:shadow-md transition-all duration-300">
               <h4 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-4 px-2">Contribution Snake</h4>
               <img 
                  src={isDarkMode 
                    ? "https://raw.githubusercontent.com/poVvisal/poVvisal/output/github-snake-dark.svg" 
                    : "https://raw.githubusercontent.com/poVvisal/poVvisal/output/github-snake.svg"
                  } 
                  alt="GitHub Snake Animation" 
                  className="w-full object-contain mix-blend-normal"
               />
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-12 md:mt-16 border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Pov Visal. Built with React & Tailwind.
          </p>
          <div className="flex space-x-6 text-slate-400 dark:text-slate-500">
            <a href="https://github.com/povvisal" target="_blank" rel="noreferrer" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;