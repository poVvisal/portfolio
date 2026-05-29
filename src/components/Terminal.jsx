import React, { useState, useEffect, useRef } from 'react';
import { SquareTerminal } from 'lucide-react';
import { fetchGeminiResponse } from '../utils/gemini';

export const TerminalComponent = () => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { command: '', output: 'Welcome to PVS Terminal.\nType "help" to see available commands.' }
  ]);
  const terminalScrollRef = useRef(null);
  const terminalEndRef = useRef(null);
  const tiltRef = useRef(null);

  // Parallax Tilt Effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!tiltRef.current) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 15; // Max tilt 15deg
      const y = (e.clientY / innerHeight - 0.5) * -15;
      tiltRef.current.style.transform = `perspective(1000px) rotateY(${x}deg) rotateX(${y}deg) translateZ(10px)`;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (terminalScrollRef.current) {
      terminalScrollRef.current.scrollTop = terminalScrollRef.current.scrollHeight;
    } else {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalHistory]);

  const handleTerminalSubmit = async (e) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const rawInput = terminalInput.trim();
    const cmd = rawInput.toLowerCase();

    // AI ask command
    if (cmd.startsWith('ask ') || cmd.startsWith('ask ✨')) {
      const query = rawInput.replace(/^ask ✨?\s*/i, '');
      const currentInput = terminalInput;
      setTerminalInput('');
      setTerminalHistory(prev => [...prev, { command: `visal@info:~$ ${currentInput}`, output: '✨ Establishing secure uplink to Gemini Oracle...' }]);

      const sysPrompt = "You are a highly advanced AI core built into Visal's deep-space terminal. Answer concisely, technically. Strictly plain text suitable for a Linux CLI.";
      const reply = await fetchGeminiResponse(query, sysPrompt);

      setTerminalHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1].output = reply;
        return newHistory;
      });
      return;
    }

    let output = '';

    // Basic shell-like commands (restored from previous version)
    if (cmd.startsWith('cd ')) {
      output = `bash: cd: restricted shell, changing to ${rawInput.substring(3)} disabled.`;
    } else if (cmd === 'cd') {
      output = '';
    } else if (cmd.startsWith('echo ')) {
      output = rawInput.substring(5);
    } else {
      switch (cmd) {
        case 'help':
          output = `Available commands:\n  help          - Show this message\n  whoami        - Display current user\n  pwd           - Print working directory\n  ls            - List directory contents\n  cd            - Change directory\n  date          - Print system date and time\n  uptime        - Tell how long the system has been running\n  uname -a      - Print system information\n  df -h         - Report file system disk space usage\n  free -m       - Display amount of free and used memory\n  history       - Display command history\n  echo [text]   - Print text to terminal\n  cat [file]    - Read file (try: cat about.txt, cat skills.sh)\n  aws s3 ls     - List AWS buckets\n  get resume    - Download my resume (PDF)\n  ask [query]   - Ask the AI a question ✨\n  clear         - Clear terminal window`;
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
          output = `drwxr-xr-x 4 povvisal povvisal 4096 May 21 10:00 .\ndrwxr-xr-x 3 root     root     4096 May 21 09:59 ..\n-rw-r--r-- 1 povvisal povvisal 1024 May 21 10:00 about.txt\n-rwxr-xr-x 1 povvisal povvisal 4096 May 21 10:00 skills.sh\n-rw-r--r-- 1 povvisal povvisal 2048 May 21 10:00 resume.pdf\ndrwxr-xr-x 2 povvisal povvisal 4096 May 21 10:00 projects\ndrwxr-xr-x 2 povvisal povvisal 4096 May 21 10:00 .aws`;
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
          output = `Filesystem      Size  Used Avail Use% Mounted on\n/dev/nvme0n1p1   20G  8.4G   12G  42% /`;
          break;
        case 'free -m':
          output = `               total        used        free      shared  buff/cache   available\nMem:            1984         512         420          10        1052        1300\nSwap:              0           0           0`;
          break;
        case 'history':
          output = terminalHistory.map((item, index) => `  ${index + 1}  ${item.command.replace('visal@info:~$ ', '')}`).join('\n');
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
          try {
            const link = document.createElement('a');
            link.href = '/resume.pdf';
            link.download = 'Pov_Visal_Resume.pdf';
            link.click();
          } catch (err) {
            // ignore in non-browser environments
          }
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

    setTerminalHistory(prev => [...prev, { command: `visal@info:~$ ${terminalInput}`, output }]);
    setTerminalInput('');
  };

  return (
    <div className="w-full flex justify-start py-6 perspective-1000 px-4 md:px-8">
      <div 
        ref={tiltRef}
        className="w-full max-w-4xl bg-slate-900/60 backdrop-blur-md rounded-xl overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)] border border-cyan-500/30 transition-transform duration-100 ease-out font-mono text-sm"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="bg-slate-800/80 px-4 py-3 flex items-center gap-2 border-b border-cyan-900/50">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div className="ml-4 text-cyan-400/80 text-xs flex items-center gap-2 font-bold tracking-widest uppercase">
            <SquareTerminal size={14} /> Nexus Uplink
          </div>
        </div>
        
        <div ref={terminalScrollRef} className="p-6 h-80 overflow-y-auto bg-[#05070e]/80 text-slate-300 flex flex-col gap-3">
          {terminalHistory.map((item, idx) => (
            <div key={idx}>
              {item.command && <div className="text-orange-400 font-bold">{item.command}</div>}
              <div className="whitespace-pre-wrap text-cyan-200 leading-relaxed">{item.output}</div>
            </div>
          ))}
          <div ref={terminalEndRef} />
          
          <form onSubmit={handleTerminalSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-orange-400 font-bold shrink-0">visal@info:~$</span>
            <input 
              type="text" 
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-cyan-100 w-full"
              autoComplete="off"
              spellCheck="false"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
