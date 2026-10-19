import React, { useState } from 'react';
import { Award, Printer, Sparkles } from 'lucide-react';

export default function CertificateMaker({ onShowToast }) {
  const [recipient, setRecipient] = useState('Aayush Shrestha');
  const [title, setTitle] = useState('Full Stack Web & Cloud Architecture');
  const [issuer, setIssuer] = useState('Bijesh Academy of Technology');
  const [date, setDate] = useState('October 2026');
  const [instructor, setInstructor] = useState('Bijesh Sharma (Lead Instructor)');

  const handlePrint = () => {
    window.print();
    if (onShowToast) onShowToast('Opening certificate print preview...');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Editor Controls (Hidden on Print) */}
      <div className="no-print p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-base">Certificate of Achievement Maker</h3>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Recipient Name</label>
            <input
              type="text"
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Course / Award Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Issuing Organization</label>
            <input
              type="text"
              value={issuer}
              onChange={e => setIssuer(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Instructor / Signatory</label>
            <input
              type="text"
              value={instructor}
              onChange={e => setInstructor(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>

      {/* Ornate Printable Certificate */}
      <div className="p-12 md:p-16 rounded-3xl bg-amber-50/95 text-slate-900 border-8 border-double border-amber-800 shadow-2xl font-serif text-center relative max-w-4xl mx-auto print-card">
        <div className="absolute top-8 left-8 text-amber-700 opacity-20">
          <Award className="w-20 h-20" />
        </div>

        <div className="space-y-6">
          <div className="inline-block px-4 py-1 border-b-2 border-amber-800 text-xs font-sans font-bold tracking-widest text-amber-900 uppercase">
            Certificate of Completion & Excellence
          </div>

          <h2 className="text-sm font-sans tracking-widest uppercase text-slate-600">
            This certifies that
          </h2>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-wide font-sans underline decoration-amber-500 decoration-2 underline-offset-8">
            {recipient}
          </h1>

          <p className="text-sm font-sans text-slate-600 max-w-xl mx-auto leading-relaxed pt-2">
            has successfully completed all requirements, practical projects, and demonstrated comprehensive mastery in
          </p>

          <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 font-sans">
            {title}
          </h3>

          <p className="text-xs font-sans text-slate-500">
            Presented on {date} by <strong className="text-slate-800">{issuer}</strong>
          </p>

          {/* Signatures */}
          <div className="pt-16 flex justify-around items-end font-sans text-xs text-slate-700">
            <div className="text-center">
              <div className="border-t border-slate-800 w-48 pt-1 font-semibold">{instructor}</div>
              <p className="text-[10px] text-slate-500">Course Director</p>
            </div>
            <div className="text-center">
              <div className="border-t border-slate-800 w-48 pt-1 font-semibold">{issuer}</div>
              <p className="text-[10px] text-slate-500">Authorized Registry</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
