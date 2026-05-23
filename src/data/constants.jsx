import React from 'react';
import { Database, Server, Code, ShieldCheck, GitBranch, Boxes } from 'lucide-react';

export const awsBadges = [
  { name: "Cloud Architecting", url: "https://www.credly.com/badges/9f7e4185-d2cf-4b4e-a4de-a7988121e425/public_url", imgSrc: "https://images.credly.com/images/fcafd0c9-42da-4703-a191-0c397203dc1b/blob" },
  { name: "Cloud Developing", url: "https://www.credly.com/badges/51b44bfe-0e50-44d5-873d-5e77e61ff798/public_url", imgSrc: "https://images.credly.com/images/bb3211c0-a562-44ec-a8b5-df54deb0e5e9/blob" },
  { name: "Cloud Operations", url: "https://www.credly.com/badges/3e1efe88-99a5-48a2-bb3d-d8d1add751cd/public_url", imgSrc: "https://images.credly.com/images/07e7ba52-aea4-431f-ba2d-a4113efd1d5a/blob" },
  { name: "Cloud Foundations", url: "https://www.credly.com/badges/0e0a0aa8-9668-4a96-a62d-574a8bccaa3f/public_url", imgSrc: "https://images.credly.com/images/e3541a0c-dd4a-4820-8052-5001006efc85/blob" }
];

export const techStack = [
  {
    category: "Backend",
    icon: <Code size={20} className="text-blue-500" />,
    items: [
      { name: "Go", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg" },
      { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" },
      { name: "Express.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg", invertDark: true },
      { name: "Flask", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flask/flask-original.svg", invertDark: true },
      { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" },
      { name: "NGINX", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nginx/nginx-original.svg" },
      { name: "Git", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" },
      { name: "GitHub", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg", invertDark: true }
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
      { name: "Drizzle", fallback: <Database size={20} className="text-slate-500" /> }
    ]
  },
  {
    category: "DevSecOps & Delivery",
    icon: <ShieldCheck size={20} className="text-rose-400" />,
    items: [
      { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg" },
      { name: "Terraform", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg" },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
      { name: "SonarQube", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sonarqube/sonarqube-original.svg" },
      { name: "Trivy", fallback: <ShieldCheck size={20} className="text-slate-500" /> },
      { name: "Docker Hub", fallback: <Boxes size={20} className="text-slate-500" /> },
      { name: "GitHub Actions", fallback: <GitBranch size={20} className="text-slate-500" /> }
    ]
  },
  {
    category: "Cloud & Infrastructure",
    icon: <Server size={20} className="text-orange-500" />,
    items: [
      { name: "AWS", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg", invertDark: true },
      { name: "Cloudflare", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg" },
      { name: "Railway", fallback: <Server size={20} className="text-slate-500" /> },
      { name: "Docker", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg" },
      { name: "Jenkins", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg" },
      { name: "Bash", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bash/bash-original.svg", invertDark: true },
      { name: "Linux", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" },
      { name: "EC2", fallback: <Server size={20} className="text-slate-500" /> }
    ]
  }
];
