import React from 'react';
import { Volume2 } from 'lucide-react';
import { vocabList } from '../data';

const VocabularyView: React.FC = () => {
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; // Prefer British English as per HK curriculum usually
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="p-4 pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-sky-600 mb-2">Word List (單詞表)</h2>
        <p className="text-gray-500">Listen, read, and remember!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {vocabList.map((word) => (
          <div 
            key={word.id} 
            className="bg-white rounded-3xl shadow-lg border-2 border-slate-100 overflow-hidden hover:border-sky-300 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="bg-sky-50 p-4 flex justify-between items-start relative overflow-hidden">
               {/* Decorative background emoji */}
              <div className="absolute -right-4 -top-4 text-8xl opacity-10 select-none pointer-events-none grayscale">
                {word.emoji}
              </div>

              <div className="z-10">
                <div className="flex items-center gap-2">
                   <span className="text-5xl shadow-sm">{word.emoji}</span>
                   <div>
                      <h3 className="text-2xl font-bold text-slate-800 leading-tight">{word.english}</h3>
                      <span className="text-base font-mono text-slate-500 bg-white/80 px-2 py-1 rounded-lg mt-1 inline-block border border-slate-200 backdrop-blur-sm">
                        {word.ipa}
                      </span>
                   </div>
                </div>
              </div>
              <button 
                onClick={() => speak(word.english)}
                className="bg-white p-3 rounded-full text-sky-500 shadow-sm hover:bg-sky-500 hover:text-white transition-colors z-10"
                aria-label="Listen"
              >
                <Volume2 size={24} />
              </button>
            </div>
            
            <div className="p-5">
              <div className="text-xl font-bold text-emerald-600 mb-3 border-b border-dashed border-slate-200 pb-2">
                {word.chinese}
              </div>
              <p className="text-slate-600 text-lg italic leading-relaxed">
                "{word.example}"
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VocabularyView;