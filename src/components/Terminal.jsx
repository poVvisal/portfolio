import React, { useState, useEffect, useRef } from 'react';
import { SquareTerminal } from 'lucide-react';
import { fetchGeminiResponse } from '../utils/gemini';

export const TerminalComponent = () => {
  const [terminalInput, setTerminalInput] = useState('');
  const [terminalHistory, setTerminalHistory] = useState([
    { command: '', output: 'Welcome to PV-SH v1.0.0.\nType "help" to see available commands.' }
  ]);
  const terminalScrollRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    const terminalContainer = terminalScrollRef.current;

    if (terminalContainer) {
      terminalContainer.scrollTop = terminalContainer.scrollHeight;
      return;
    }

    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

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
        { command: `visal@info:~$ ${currentInput}`, output: '✨ Consulting the cloud oracle...' }
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

    setTerminalHistory([...terminalHistory, { command: `visal@info:~$ ${terminalInput}`, output }]);
    setTerminalInput('');
  };

  return (
    <div className="bg-slate-900/80 rounded-xl overflow-hidden shadow-2xl border border-slate-700 hover:border-orange-500/50 transition-colors duration-300 font-mono text-sm max-w-4xl backdrop-blur-sm">
      <div className="bg-slate-800/90 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="ml-4 text-slate-400 text-xs flex items-center gap-2 font-sans font-medium tracking-wide">
          <SquareTerminal size={14} /> visal@info: ~
        </div>
      </div>
      
      <div ref={terminalScrollRef} className="p-5 h-72 overflow-y-auto bg-slate-950/80 text-slate-300 flex flex-col gap-2">
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
          <span className="text-orange-400 shrink-0">visal@info:~$</span>
          <input 
            type="text" 
            value={terminalInput}
            onChange={(e) => setTerminalInput(e.target.value)}
            className="bg-transparent border-none outline-none flex-1 text-slate-200 w-full"
            autoComplete="off"
            spellCheck="false"
          />
        </form>
      </div>
    </div>
  );
};
