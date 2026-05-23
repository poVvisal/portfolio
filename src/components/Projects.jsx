import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Terminal, Server, Database } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { Github } from './Icons';

export const Projects = () => {
  const [isProjectExpanded, setIsProjectExpanded] = useState(false);
  const [isMicroservicesExpanded, setIsMicroservicesExpanded] = useState(false);

  return (
    <AnimatedSection id="projects">
      <div className="mb-10 text-left">
        <h3 className="text-3xl font-bold mb-4 text-white">Featured Architecture</h3>
        <p className="max-w-2xl text-slate-400 text-lg">
          Interactive breakdown of my core infrastructure projects, demonstrating DevSecOps, IaC, and Containerization.
        </p>
      </div>

      <div className="space-y-6">
      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <span className="text-orange-500 text-sm font-mono font-bold tracking-wider uppercase mb-3 block">Enterprise Deployment Strategy</span>
              <h4 className="text-2xl md:text-3xl font-bold text-white">CI/CD Pipeline for Containerised Web App on AWS</h4>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg" alt="AWS" className="w-10 h-10 object-contain filter invert brightness-0" />
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" className="w-10 h-10 object-contain" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" alt="Terraform" className="w-10 h-10 object-contain" />
               <a
                 href="https://github.com/poVvisal/ExpressHub.git"
                 target="_blank"
                 rel="noreferrer"
                 aria-label="Open ExpressHub GitHub repository"
                 className="text-slate-400 hover:text-white transition-colors"
               >
                 <Github size={26} />
               </a>
            </div>
          </div>
          
          <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-4xl">
            An end-to-end automated deployment pipeline integrating security scans, infrastructure as code, and container orchestration to deliver a highly available web application on Amazon Web Services.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {['Jenkins', 'SonarQube', 'Trivy', 'Terraform', 'AWS S3 & DynamoDB'].map(tag => (
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

      <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-sm transition-all duration-300 hover:border-orange-500/50 hover:shadow-md">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6">
            <div>
              <span className="text-orange-500 text-sm font-mono font-bold tracking-wider uppercase mb-3 block">Cloud Native Architecture</span>
              <h4 className="text-2xl md:text-3xl font-bold text-white">Containerized E-Sports Team Management System</h4>
            </div>
            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-xl border border-slate-700">
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" alt="Docker" className="w-10 h-10 object-contain" />
               <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" alt="Node.js" className="w-10 h-10 object-contain" />
              <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg" alt="MongoDB" className="w-10 h-10 object-contain" />
               <a
                 href="https://github.com/poVvisal/Esport_Club.git"
                 target="_blank"
                 rel="noreferrer"
                 aria-label="Open Esport Club GitHub repository"
                 className="text-slate-400 hover:text-white transition-colors"
               >
                 <Github size={26} />
               </a>
            </div>
          </div>
          
          <p className="text-slate-300 mb-8 text-lg leading-relaxed max-w-4xl">
            An end-to-end microservices-based application built to handle esports team operations, utilizing a custom API Gateway and completely isolated backend services for high availability and easy cloud scaling.
          </p>

          <div className="flex flex-wrap gap-3 mb-10">
            {['Docker', 'Node.js', 'MongoDB', 'JWT Auth', 'Express.js', 'API Gateway'].map(tag => (
              <span key={tag} className="bg-slate-900/50 text-slate-300 px-4 py-1.5 text-sm rounded-full font-mono border border-slate-600">
                {tag}
              </span>
            ))}
          </div>

          <button 
            onClick={() => setIsMicroservicesExpanded(!isMicroservicesExpanded)} 
            className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors font-semibold focus:outline-none bg-orange-500/10 px-6 py-3 rounded-xl border border-orange-500/20 hover:border-orange-500/50"
          >
            {isMicroservicesExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />} 
            {isMicroservicesExpanded ? 'Hide Architecture Details' : 'Explore Architecture Details'}
          </button>
        </div>

        <div className={`transition-all duration-500 ease-in-out ${isMicroservicesExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className="bg-slate-900/50 p-8 md:p-10 border-t border-slate-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-4 flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Server size={20} /></div> Decoupled Microservices
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Engineered a custom API Gateway to securely route traffic across isolated Auth, Coach, and Player microservices. This decoupled approach ensures each service scales independently without bottlenecking the overall system.
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-4 flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Database size={20} /></div> Dockerized Infrastructure
                </h5>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Automated the deployment of all four services and the database using Docker Compose with secure, isolated bridge networks. The entire stack is containerized and fully cloud-ready for AWS container services.
                </p>
              </div>
              <div className="bg-slate-800 p-6 rounded-xl border border-slate-700/50">
                <h5 className="font-bold mb-4 flex items-center gap-3 text-white text-lg">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500"><Terminal size={20} /></div> Secure Role-Based Access
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
