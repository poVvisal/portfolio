import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Terminal, Server, Database } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { Github } from './Icons';

export const Projects = () => {
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const [isMicroservicesExpanded, setIsMicroservicesExpanded] = useState(false);

  return (
    <AnimatedSection id="projects" className="max-w-4xl">
      <div className="mb-8 text-left">
        <h3 className="text-3xl font-bold mb-3 text-white">Featured Architecture</h3>
        <p className="max-w-2xl text-slate-400 text-base md:text-lg">
          Interactive breakdown of my core infrastructure projects, demonstrating DevSecOps, IaC, and Containerization.
        </p>
      </div>

      <div className="space-y-5">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-5">
            <div>
              <span className="text-orange-500 text-sm font-mono font-bold tracking-wider uppercase mb-3 block">Enterprise Deployment Strategy</span>
              <h4 className="text-xl md:text-2xl font-bold text-white">CI/CD Pipeline for Containerised Web App on AWS</h4>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-700">
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className="w-8 h-8 object-contain filter invert brightness-0" />
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" className="w-8 h-8 object-contain" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" alt="Terraform" className="w-8 h-8 object-contain" />
               <a
                 href="https://github.com/poVvisal/ExpressHub.git"
                 target="_blank"
                 rel="noreferrer"
                 aria-label="Open ExpressHub GitHub repository"
                 className="text-slate-400 hover:text-white transition-colors"
               >
                 <Github size={22} />
               </a>
            </div>
          </div>
          
          <p className="text-slate-300 mb-6 text-base md:text-lg leading-relaxed max-w-3xl">
            An end-to-end automated deployment pipeline integrating security scans, infrastructure as code, and container orchestration to deliver a highly available web application on Amazon Web Services.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-7">
            {['Jenkins', 'SonarQube', 'Trivy', 'Terraform', 'AWS S3 & DynamoDB'].map(tag => (
              <span key={tag} className="bg-slate-900/50 text-slate-300 px-3 py-1.5 text-xs md:text-sm rounded-full font-mono border border-slate-600">
                {tag}
              </span>
            ))}
          </div>

          <button 
            onClick={() => setIsProjectExpanded(!isProjectExpanded)} 
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-semibold focus:outline-none bg-orange-500/10 px-5 py-2.5 rounded-xl border border-orange-500/20 hover:border-orange-500/50"
          >
            {isProjectExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />} 
            {isProjectExpanded ? 'Hide Architecture Details' : 'Explore Architecture Details'}
          </button>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${isProjectExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="bg-slate-900/50 p-6 md:p-8 border-t border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-3 flex items-center gap-3 text-white text-base md:text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Terminal size={18} /></div> Automated DevSecOps
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Jenkins pipeline triggered on main pushes. Integrates SonarQube quality gates for code analysis and Trivy security scans for both source code and container images, ensuring secure deployments.
                </p>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-3 flex items-center gap-3 text-white text-base md:text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Server size={18} /></div> Secure IaC
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Utilized Terraform to provision least-privilege EC2 instances. Implemented remote state management and state locking utilizing AWS S3 and DynamoDB to prevent configuration drift.
                </p>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-3 flex items-center gap-3 text-white text-base md:text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Database size={18} /></div> Dockerized Deployment
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automates the build process and DockerHub push. Executes multi-node deployments with verified SSH readiness checks and automated HTTP health checks post-deployment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md">
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-5">
            <div>
              <span className="text-orange-500 text-sm font-mono font-bold tracking-wider uppercase mb-3 block">Cloud Native Architecture</span>
              <h4 className="text-xl md:text-2xl font-bold text-white">Containerized E-Sports Team Management System</h4>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-xl border border-slate-700">
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" className="w-8 h-8 object-contain" />
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-8 h-8 object-contain" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-8 h-8 object-contain" />
               <a
                 href="https://github.com/poVvisal/Esport_Club.git"
                 target="_blank"
                 rel="noreferrer"
                 aria-label="Open Esport Club GitHub repository"
                 className="text-slate-400 hover:text-white transition-colors"
               >
                 <Github size={22} />
               </a>
            </div>
          </div>
          
          <p className="text-slate-300 mb-6 text-base md:text-lg leading-relaxed max-w-3xl">
            An end-to-end microservices-based application built to handle esports team operations, utilizing a custom API Gateway and completely isolated backend services for high availability and easy cloud scaling.
          </p>

          <div className="flex flex-wrap gap-2.5 mb-7">
            {['Docker', 'Node.js', 'MongoDB', 'JWT Auth', 'Express.js', 'API Gateway'].map(tag => (
              <span key={tag} className="bg-slate-900/50 text-slate-300 px-3 py-1.5 text-xs md:text-sm rounded-full font-mono border border-slate-600">
                {tag}
              </span>
            ))}
          </div>

          <button 
            onClick={() => setIsMicroservicesExpanded(!isMicroservicesExpanded)} 
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-semibold focus:outline-none bg-orange-500/10 px-5 py-2.5 rounded-xl border border-orange-500/20 hover:border-orange-500/50"
          >
            {isMicroservicesExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />} 
            {isMicroservicesExpanded ? 'Hide Architecture Details' : 'Explore Architecture Details'}
          </button>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${isMicroservicesExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="bg-slate-900/50 p-6 md:p-8 border-t border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-3 flex items-center gap-3 text-white text-base md:text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Server size={18} /></div> Decoupled Microservices
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Engineered a custom API Gateway to securely route traffic across isolated Auth, Coach, and Player microservices. This decoupled approach ensures each service scales independently without bottlenecking the overall system.
                </p>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-3 flex items-center gap-3 text-white text-base md:text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Database size={18} /></div> Dockerized Infrastructure
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automated the deployment of all four services and the database using Docker Compose with secure, isolated bridge networks. The entire stack is containerized and fully cloud-ready for AWS container services.
                </p>
              </div>
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-3 flex items-center gap-3 text-white text-base md:text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Terminal size={18} /></div> Secure Role-Based Access
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Implemented a stateless JWT authentication flow to protect endpoints and manage user sessions. Enforces strict role-based access control (RBAC) specifically tailored for administrators, coaches, and players.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </AnimatedSection>
  );
};
