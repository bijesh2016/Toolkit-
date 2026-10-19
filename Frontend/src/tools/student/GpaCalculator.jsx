import React, { useState } from 'react';
import { GraduationCap, Plus, Trash2, Sparkles, Award } from 'lucide-react';

const GRADE_POINTS = {
  'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D': 1.0, 'F': 0.0
};

export default function GpaCalculator({ onShowToast }) {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Data Structures & Algorithms', credits: 3, grade: 'A' },
    { id: 2, name: 'Web Technology & Cloud', credits: 3, grade: 'A-' },
    { id: 3, name: 'Database Management Systems', credits: 3, grade: 'B+' },
    { id: 4, name: 'Operating Systems', credits: 3, grade: 'A' }
  ]);

  const [prevCgpa, setPrevCgpa] = useState('');
  const [prevCredits, setPrevCredits] = useState('');

  const addCourse = () => {
    setCourses(prev => [
      ...prev,
      { id: Date.now(), name: 'New Course', credits: 3, grade: 'A' }
    ]);
  };

  const removeCourse = (id) => {
    if (courses.length <= 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id, field, val) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: val } : c));
  };

  // Calculations
  const currentTotalCredits = courses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0);
  const currentTotalPoints = courses.reduce((sum, c) => sum + (Number(c.credits) || 0) * (GRADE_POINTS[c.grade] || 0), 0);
  const currentGpa = currentTotalCredits > 0 ? (currentTotalPoints / currentTotalCredits).toFixed(2) : '0.00';

  // Cumulative CGPA
  let cumulativeCgpa = currentGpa;
  if (prevCgpa && prevCredits) {
    const pC = Number(prevCredits) || 0;
    const pG = Number(prevCgpa) || 0;
    const totalCreds = pC + currentTotalCredits;
    const totalPts = (pC * pG) + currentTotalPoints;
    cumulativeCgpa = totalCreds > 0 ? (totalPts / totalCreds).toFixed(2) : currentGpa;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-gradient-to-tr from-indigo-950/60 to-slate-900 border border-indigo-500/30 shadow-xl text-center">
          <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Current Semester GPA</span>
          <div className="text-4xl sm:text-5xl font-black text-white mt-1">{currentGpa}</div>
          <span className="text-xs text-slate-400 mt-1 block">Total Credits: {currentTotalCredits}</span>
        </div>

        <div className="p-6 rounded-3xl bg-gradient-to-tr from-purple-950/60 to-slate-900 border border-purple-500/30 shadow-xl text-center">
          <span className="text-xs uppercase font-bold tracking-wider text-purple-400">Cumulative CGPA</span>
          <div className="text-4xl sm:text-5xl font-black text-white mt-1">{cumulativeCgpa}</div>
          <span className="text-xs text-slate-400 mt-1 block">4.0 Scale Standard</span>
        </div>
      </div>

      {/* Courses Form */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Course Grades & Credit Hours</h3>
          </div>
          <button
            onClick={addCourse}
            className="text-xs px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-1 shadow-md"
          >
            <Plus className="w-3.5 h-3.5" /> Add Course
          </button>
        </div>

        <div className="space-y-2">
          {courses.map(course => (
            <div key={course.id} className="flex gap-2 items-center">
              <input
                type="text"
                value={course.name}
                onChange={e => updateCourse(course.id, 'name', e.target.value)}
                placeholder="Course Subject Title"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
              />
              <input
                type="number"
                min="1"
                max="6"
                value={course.credits}
                onChange={e => updateCourse(course.id, 'credits', Number(e.target.value))}
                placeholder="Credits"
                className="w-20 bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white text-center"
              />
              <select
                value={course.grade}
                onChange={e => updateCourse(course.id, 'grade', e.target.value)}
                className="w-24 bg-slate-950 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white font-bold"
              >
                {Object.keys(GRADE_POINTS).map(g => (
                  <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>
                ))}
              </select>
              <button
                onClick={() => removeCourse(course.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {/* Previous CGPA option */}
        <div className="pt-4 border-t border-slate-800">
          <span className="text-xs font-semibold text-slate-400 block mb-2">Previous Cumulative Records (Optional):</span>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              placeholder="Prior CGPA (e.g. 3.65)"
              value={prevCgpa}
              onChange={e => setPrevCgpa(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
            <input
              type="number"
              placeholder="Prior Total Credits (e.g. 45)"
              value={prevCredits}
              onChange={e => setPrevCredits(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
