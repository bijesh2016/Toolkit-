import React, { useState } from 'react';
import { UserCheck, Printer, Plus, Trash2, Mail, Phone, MapPin, Globe } from 'lucide-react';

export default function ResumeBuilder({ onShowToast }) {
  const [profile, setProfile] = useState({
    name: 'Bijesh Sharma',
    title: 'Senior Full Stack Software Engineer',
    email: 'bijesh@bijeshsharam.com.np',
    phone: '+977 9800000000',
    location: 'Kathmandu, Nepal',
    website: 'bijeshsharam.com.np',
    summary: 'Proactive and results-driven software engineer with 6+ years of experience designing scalable web architectures, developer utility suites, and high-performance APIs. Passionate about privacy-first software, cloud tools, and developer experience.'
  });

  const [experiences, setExperiences] = useState([
    {
      id: 1,
      role: 'Lead Architect',
      company: 'Tech Solutions Global',
      period: '2022 - Present',
      details: 'Spearheaded full-stack development of enterprise web tools serving over 150,000 monthly active users. Reduced latency by 45% using optimized microservices and serverless workers.'
    },
    {
      id: 2,
      role: 'Full Stack Developer',
      company: 'Himalayan Innovations Pvt. Ltd.',
      period: '2019 - 2022',
      details: 'Built automated document converters, financial invoice workflows with Nepal VAT compliance, and cloud backup integrations using React and Node.js.'
    }
  ]);

  const [skills, setSkills] = useState('React, JavaScript, Node.js, Express, Docker, PostgreSQL, Tailwind CSS, REST APIs, Git, Next.js');

  const handlePrint = () => {
    window.print();
    if (onShowToast) onShowToast('Opening print dialog for Resume...');
  };

  const addExperience = () => {
    setExperiences(prev => [
      ...prev,
      { id: Date.now(), role: 'New Role', company: 'Company Name', period: '2023 - 2024', details: 'Key achievement and responsibility summary.' }
    ]);
  };

  const removeExperience = (id) => {
    if (experiences.length <= 1) return;
    setExperiences(experiences.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Configuration Controls (Hidden on Print) */}
      <div className="no-print p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">ATS-Friendly Resume / CV Builder</h3>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" /> Print / Save as PDF
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            placeholder="Full Name"
            value={profile.name}
            onChange={e => setProfile({ ...profile, name: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Professional Title"
            value={profile.title}
            onChange={e => setProfile({ ...profile, title: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Email"
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={profile.phone}
            onChange={e => setProfile({ ...profile, phone: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Location (City, Country)"
            value={profile.location}
            onChange={e => setProfile({ ...profile, location: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Portfolio / Website"
            value={profile.website}
            onChange={e => setProfile({ ...profile, website: e.target.value })}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Professional Summary</label>
          <textarea
            value={profile.summary}
            onChange={e => setProfile({ ...profile, summary: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white h-20 resize-none"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-400 mb-1">Skills (Comma-separated)</label>
          <input
            type="text"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
        </div>
      </div>

      {/* Printable Resume Preview */}
      <div className="p-10 rounded-3xl bg-white text-slate-900 border border-slate-300 shadow-2xl font-sans max-w-4xl mx-auto print-card">
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">{profile.name}</h1>
          <p className="text-sm font-bold text-indigo-600 mt-0.5">{profile.title}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-3">
            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {profile.email}</span>
            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-400" /> {profile.phone}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {profile.location}</span>
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-slate-400" /> {profile.website}</span>
          </div>
        </div>

        {/* Summary */}
        <div className="py-4 border-b border-slate-200">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">Professional Summary</h2>
          <p className="text-xs text-slate-700 leading-relaxed">{profile.summary}</p>
        </div>

        {/* Experience */}
        <div className="py-4 border-b border-slate-200 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Work Experience</h2>
          {experiences.map(exp => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-slate-900">{exp.role} <span className="font-normal text-slate-500">at</span> {exp.company}</h3>
                <span className="text-xs font-semibold text-slate-500">{exp.period}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{exp.details}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="py-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Core Technical Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.split(',').map((s, idx) => (
              <span key={idx} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-medium text-slate-800">
                {s.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
