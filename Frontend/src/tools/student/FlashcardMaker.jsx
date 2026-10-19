import React, { useState } from 'react';
import { BookOpen, ArrowLeft, ArrowRight, RotateCw, Plus, Trash2, Sparkles } from 'lucide-react';

const INITIAL_CARDS = [
  { id: 1, front: 'What is the capital of Koshi Province in Nepal?', back: 'Biratnagar' },
  { id: 2, front: 'What is the standard VAT rate in Nepal?', back: '13% (Value Added Tax)' },
  { id: 3, front: 'What is the time difference of Nepal Time (NPT) from UTC?', back: 'UTC + 5:45' },
  { id: 4, front: 'Which HTTP status code signifies "Too Many Requests"?', back: 'HTTP 429' },
  { id: 5, front: 'What is the base calibration date for BS 2070-01-01?', back: 'April 14, 2013 (AD)' }
];

export default function FlashcardMaker({ onShowToast }) {
  const [cards, setCards] = useState(INITIAL_CARDS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // New card form
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const currentCard = cards[currentIndex] || cards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % cards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + cards.length) % cards.length);
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    setCards(prev => [
      ...prev,
      { id: Date.now(), front: newFront.trim(), back: newBack.trim() }
    ]);
    setNewFront('');
    setNewBack('');
    setShowAddForm(false);
    if (onShowToast) onShowToast('Added new study flashcard!');
  };

  const handleDeleteCard = (id) => {
    if (cards.length <= 1) return;
    setCards(cards.filter(c => c.id !== id));
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400">
          Card <strong className="text-indigo-400">{currentIndex + 1}</strong> of {cards.length}
        </span>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1 shadow-md transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Card
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form onSubmit={handleAddCard} className="p-5 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3 animate-fade-in">
          <input
            type="text"
            placeholder="Front (Question / Prompt)"
            value={newFront}
            onChange={e => setNewFront(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <input
            type="text"
            placeholder="Back (Answer / Explanation)"
            value={newBack}
            onChange={e => setNewBack(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs"
            >
              Save Card
            </button>
          </div>
        </form>
      )}

      {/* Interactive 3D Flip Card */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="w-full h-72 rounded-3xl cursor-pointer select-none perspective-1000 group"
      >
        <div
          className={`relative w-full h-full rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-2xl border transition-all duration-500 ${
            isFlipped
              ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/40 text-emerald-200'
              : 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/40 text-white'
          }`}
        >
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2">
            {isFlipped ? 'ANSWER (BACK)' : 'PROMPT (FRONT) • CLICK TO FLIP'}
          </span>

          <p className="text-lg md:text-xl font-bold leading-relaxed max-w-sm">
            {isFlipped ? currentCard.back : currentCard.front}
          </p>

          <span className="mt-6 text-xs text-slate-500 flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Tap card to flip
          </span>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          className="flex-1 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <button
          onClick={() => handleDeleteCard(currentCard.id)}
          className="p-3 rounded-2xl bg-slate-900 hover:bg-rose-900/30 text-slate-500 hover:text-rose-400 border border-slate-800"
          title="Delete this card"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={handleNext}
          className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
        >
          <span>Next</span> <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
