import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, ChevronDown, ChevronUp, Download,
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

const AnimatedSection = ({ children, className = "", id }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
        observer.unobserve(domRef.current);
      }
    }, { threshold: 0.15 });
    
    const { current } = domRef;
    if (current) observer.observe(current);
    
    return () => { if (current) observer.unobserve(current); };
  }, []);

  return (
    <section 
      id={id}
      ref={domRef} 
      className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} w-full ${className}`}
    >
      {children}
    </section>
  );
};

const App = () => {
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

  // Permanently enforce dark mode and mouse tracking for interactive background
  useEffect(() => {
    document.documentElement.classList.add('dark');
    
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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

    if (cmd.startsWith('cd ')) {
      output = `bash: cd: restricted shell, changing to ${rawInput.substring(3)} disabled.`;
    } else if (cmd === 'cd') {
      output = '';
    } else if (cmd.startsWith('echo ')) {
      output = rawInput.substring(5);
    } else {
      switch (cmd) {
        case 'help':
          output = `Available commands:
  help          - Show this message
  whoami        - Display current user
  pwd           - Print working directory
  ls            - List directory contents
  cd            - Change directory
  date          - Print system date and time
  uptime        - Tell how long the system has been running
  uname -a      - Print system information
  df -h         - Report file system disk space usage
  free -m       - Display amount of free and used memory
  history       - Display command history
  echo [text]   - Print text to terminal
  cat [file]    - Read file (try: cat about.txt, cat skills.sh)
  aws s3 ls     - List AWS buckets
  get resume    - Download my resume (PDF)
  ask [query]   - Ask the AI a question ✨
  clear         - Clear terminal window`;
          break;
        case 'whoami':
          output = 'povvisal - Junior Cloud Infrastructure Engineer';
          break;
        case 'pwd':
          output = '/home/povvisal';
          break;
        case 'ls':
        case 'ls -la':
        case 'll':
          output = `drwxr-xr-x 4 povvisal povvisal 4096 May 21 10:00 .
drwxr-xr-x 3 root     root     4096 May 21 09:59 ..
-rw-r--r-- 1 povvisal povvisal 1024 May 21 10:00 about.txt
-rwxr-xr-x 1 povvisal povvisal 4096 May 21 10:00 skills.sh
-rw-r--r-- 1 povvisal povvisal 2048 May 21 10:00 resume.pdf
drwxr-xr-x 2 povvisal povvisal 4096 May 21 10:00 projects
drwxr-xr-x 2 povvisal povvisal 4096 May 21 10:00 .aws`;
          break;
        case 'date':
          output = new Date().toString();
          break;
        case 'uptime':
          output = ' 10:03:00 up 42 days,  3:14,  1 user,  load average: 0.01, 0.05, 0.00';
          break;
        case 'uname -a':
          output = 'Linux aws-portfolio-node 6.1.85-99.169.amzn2023.x86_64 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux';
          break;
        case 'df -h':
          output = `Filesystem      Size  Used Avail Use% Mounted on
/dev/nvme0n1p1   20G  8.4G   12G  42% /`;
          break;
        case 'free -m':
          output = `               total        used        free      shared  buff/cache   available
Mem:            1984         512         420          10        1052        1300
Swap:              0           0           0`;
          break;
        case 'history':
          output = terminalHistory.map((item, index) => `  ${index + 1}  ${item.command.replace('visal@portfolio:~$ ', '')}`).join('\n');
          output += `\n  ${terminalHistory.length + 1}  history`;
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
    }

    setTerminalHistory([...terminalHistory, { command: `visal@portfolio:~$ ${terminalInput}`, output }]);
    setTerminalInput('');
  };

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
    <div className="relative min-h-screen bg-slate-900 text-slate-200 transition-colors duration-300 font-sans selection:bg-orange-500 selection:text-white pb-16 overflow-hidden">
      
      {/* Interactive Cursor Background */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(249, 115, 22, 0.06), transparent 40%)`
        }}
      />

      <nav className="fixed w-full bg-slate-900/80 backdrop-blur-md shadow-sm border-b border-slate-800 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 font-bold text-xl tracking-tight">
              PV<span className="text-orange-500">.</span>
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

      <main className="relative z-10 pt-20 md:pt-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16 md:space-y-24">
        
        <AnimatedSection id="hero" className="text-left pt-10 md:pt-16 pb-6 md:pb-8">
          <p className="text-orange-500 font-semibold tracking-wide uppercase mb-4 flex items-center justify-start gap-2">
            <Terminal size={18} /> Welcome to my portfolio
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-white leading-tight">
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Pov Visal</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium mb-10 max-w-2xl text-slate-400 leading-relaxed">
            Junior Cloud Infrastructure Engineer | AWS & DevOps Enthusiast
          </h2>
          
          <div className="flex justify-start flex-wrap gap-4 mb-8">
            <a href="#projects" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors shadow-lg">
              View Architecture
            </a>
            <a href="/resume.pdf" download="Pov_Visal_Resume.pdf" className="bg-slate-800 border border-slate-700 text-slate-200 px-6 py-3 rounded-lg font-medium hover:border-orange-500 hover:text-orange-400 transition-colors shadow-sm flex items-center gap-2">
              <Download size={18} /> Download CV
            </a>
            <a href="mailto:P.visal6927@gmail.com" className="bg-slate-800 border border-slate-700 text-slate-200 px-6 py-3 rounded-lg font-medium hover:border-orange-500 transition-colors shadow-sm">
              Contact Me
            </a>
            <button 
              onClick={handleGeneratePitch}
              disabled={isGeneratingPitch}
              className="group flex items-center gap-2 bg-gradient-to-r from-slate-800 to-slate-800 border border-orange-900/50 text-orange-400 px-6 py-3 rounded-lg font-medium hover:border-orange-500 transition-all shadow-sm disabled:opacity-70"
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
            <div className="max-w-2xl mb-10 p-5 bg-slate-800/50 border border-orange-900/30 rounded-xl shadow-sm text-left animate-fade-in-up relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-orange-400 to-amber-500"></div>
              <p className="text-slate-300 italic text-sm md:text-base pr-4 pl-2 leading-relaxed">
                "{aiPitch}"
              </p>
            </div>
          )}

          <div className="flex justify-start gap-6 mt-6">
            <a href="https://github.com/povvisal" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors">
              <Github size={24} />
            </a>
            <a href="https://www.linkedin.com/in/visal-pov-891444296/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:P.visal6927@gmail.com" className="text-slate-500 hover:text-orange-500 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </AnimatedSection>

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
                  {["Cloud Architecture", "Linux Administration", "Networking", "Cybersecurity"].map(course => (
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

        <AnimatedSection id="cli" className="w-full">
          <div className="bg-slate-900/80 rounded-xl overflow-hidden shadow-2xl border border-slate-700 hover:border-orange-500/50 transition-colors duration-300 font-mono text-sm max-w-4xl backdrop-blur-sm">
            <div className="bg-slate-800/90 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="ml-4 text-slate-400 text-xs flex items-center gap-2 font-sans font-medium tracking-wide">
                <SquareTerminal size={14} /> visal@portfolio: ~
              </div>
            </div>
            
            <div className="p-5 h-72 overflow-y-auto bg-slate-950/80 text-slate-300 flex flex-col gap-2">
              {terminalHistory.map((item, idx) => (
                <div key={idx}>
                  {item.command && (
                    <div className="text-orange-400">
                      {item.command}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-emerald-400 leading-relaxed">{item.output}</div>
                </div>
              ))}
              <div ref={terminalEndRef} />
              
              <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 mt-3">
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
        </AnimatedSection>

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

        <AnimatedSection id="projects">
          <div className="mb-10 text-left">
            <h3 className="text-3xl font-bold mb-4 text-white">Featured Architecture</h3>
            <p className="max-w-2xl text-slate-400 text-lg">
              Interactive breakdown of my core infrastructure project, demonstrating DevSecOps, IaC, and Containerization.
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
                <div>
                  <span className="text-orange-500 text-sm font-mono font-bold tracking-wider uppercase mb-3 block">Enterprise Deployment Strategy</span>
                  <h4 className="text-2xl md:text-3xl font-bold text-white">CI/CD Pipeline for Containerised Web App on AWS</h4>
                </div>
                <div className="flex gap-4 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
                   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className="w-10 h-10 object-contain filter invert brightness-0" />
                   <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" className="w-10 h-10 object-contain" />
                </div>
              </div>
              
              <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-4xl">
                An end-to-end automated deployment pipeline integrating security scans, infrastructure as code, and container orchestration to deliver a highly available web application on Amazon Web Services.
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                {["Jenkins", "SonarQube", "Trivy", "Terraform", "AWS S3 & DynamoDB"].map(tag => (
                  <span key={tag} className="bg-slate-900/50 text-slate-300 px-4 py-1.5 text-sm rounded-full font-mono border border-slate-600">
                    {tag}
                  </span>
                ))}
              </div>

              <button 
                onClick={() => setIsProjectExpanded(!isProjectExpanded)} 
                className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-semibold focus:outline-none bg-orange-500/10 px-6 py-3 rounded-xl border border-orange-500/20 hover:border-orange-500/50"
              >
                {isProjectExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />} 
                {isProjectExpanded ? 'Hide Architecture Details' : 'Explore Architecture Details'}
              </button>
            </div>

            <div className={`transition-all duration-500 ease-in-out ${isProjectExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
              <div className="bg-slate-900/50 p-8 md:p-10 border-t border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                    <h5 className="font-bold mb-4 flex items-center gap-3 text-white text-lg">
                      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Terminal size={20} /></div> Automated DevSecOps
                    </h5>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Jenkins pipeline triggered on main pushes. Integrates SonarQube quality gates for code analysis and Trivy security scans for both source code and container images, ensuring secure deployments.
                    </p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                    <h5 className="font-bold mb-4 flex items-center gap-3 text-white text-lg">
                      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Server size={20} /></div> Secure IaC
                    </h5>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Utilized Terraform to provision least-privilege EC2 instances. Implemented remote state management and state locking utilizing AWS S3 and DynamoDB to prevent configuration drift.
                    </p>
                  </div>
                  <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                    <h5 className="font-bold mb-4 flex items-center gap-3 text-white text-lg">
                      <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Database size={20} /></div> Dockerized Deployment
                    </h5>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Automates the build process and DockerHub push. Executes multi-node deployments with verified SSH readiness checks and automated HTTP health checks post-deployment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

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
      </main>

      <footer className="relative z-10 mt-16 border-t border-slate-800 pt-8 pb-8 bg-slate-900/50">
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
    </div>
  );
};

export default App;