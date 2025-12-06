import React, { useState, useEffect } from 'react';
import { vocabList } from '../data';
import { RefreshCcw, Check } from 'lucide-react';
import { Vocabulary } from '../types';

const GameScramble: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<Vocabulary | null>(null);
  const [scrambledLetters, setScrambledLetters] = useState<{id: number, char: string}[]>([]);
  const [userAnswer, setUserAnswer] = useState<{id: number, char: string}[]>([]);
  const [message, setMessage] = useState('');
  const [score, setScore] = useState(0);

  const nextWord = () => {
    const randomWord = vocabList[Math.floor(Math.random() * vocabList.length)];
    setCurrentWord(randomWord);
    setMessage('');
    setUserAnswer([]);

    // Remove spaces for the scramble part to make it purely about letter ordering
    const letters = randomWord.english.split('').filter(c => c !== ' ').map((char, index) => ({
      id: index,
      char: char
    }));
    
    // Shuffle
    setScrambledLetters(letters.sort(() => 0.5 - Math.random()));
  };

  useEffect(() => {
    nextWord();
  }, []);

  const handleLetterClick = (letterObj: {id: number, char: string}) => {
    // Move from bank to answer
    setScrambledLetters(prev => prev.filter(l => l.id !== letterObj.id));
    setUserAnswer(prev => [...prev, letterObj]);
  };

  const handleAnswerClick = (letterObj: {id: number, char: string}) => {
    // Move from answer back to bank
    setUserAnswer(prev => prev.filter(l => l.id !== letterObj.id));
    setScrambledLetters(prev => [...prev, letterObj]);
  };

  const checkAnswer = () => {
    if (!currentWord) return;
    
    const userString = userAnswer.map(l => l.char).join('').toLowerCase();
    const targetString = currentWord.english.replace(/\s/g, '').toLowerCase();

    if (userString === targetString) {
      setMessage('Correct! 🎉');
      setScore(s => s + 10);
      const audio = new Audio('https://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3'); 
      audio.volume = 0.2;
      audio.play().catch(() => {});
      setTimeout(nextWord, 1500);
    } else {
      setMessage('Try again! 😅');
    }
  };

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-sky-600">Spelling Bee</h2>
        <div className="bg-sky-100 px-4 py-1 rounded-full text-sky-700 font-bold">
          Score: {score}
        </div>
      </div>

      <div className="bg-white w-full rounded-3xl p-8 shadow-lg border-b-4 border-slate-200 mb-8 text-center relative overflow-hidden">
        <div className="absolute top-4 right-4 text-6xl opacity-10 grayscale select-none">
          {currentWord.emoji}
        </div>
        <p className="text-slate-400 text-sm uppercase font-bold tracking-wider mb-2">Translate this</p>
        <h3 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">{currentWord.chinese}</h3>
        <div className="text-6xl mb-4">{currentWord.emoji}</div>
      </div>

      {/* Answer Area with Underlines and Spaces */}
      <div className="w-full bg-slate-50 rounded-2xl p-6 mb-6 border-2 border-dashed border-sky-200 flex flex-col items-center">
        <div className="flex flex-wrap gap-1 md:gap-2 justify-center items-end min-h-[60px]">
          {/* Render slots based on the actual word structure including spaces */}
          {(() => {
            let letterIndex = 0;
            return currentWord.english.split('').map((char, index) => {
              if (char === ' ') {
                 // Finger space
                 return <div key={index} className="w-6 md:w-12 h-12 flex items-center justify-center"></div>;
              }

              const letterObj = userAnswer[letterIndex];
              letterIndex++;

              return (
                <div key={index} className="flex flex-col items-center gap-1">
                  {letterObj ? (
                     <button
                     onClick={() => handleAnswerClick(letterObj)}
                     className="w-10 h-10 md:w-12 md:h-12 bg-sky-500 text-white rounded-lg shadow-md font-bold text-xl flex items-center justify-center hover:bg-sky-600 transition animate-pop-in"
                   >
                     {letterObj.char}
                   </button>
                  ) : (
                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
                      {/* Empty placeholder */}
                    </div>
                  )}
                  {/* Underline */}
                  <div className="w-8 md:w-10 h-1.5 bg-slate-300 rounded-full"></div>
                </div>
              );
            });
          })()}
        </div>
        {userAnswer.length === 0 && (
          <p className="text-slate-400 text-sm mt-4">Tap the letters below to spell the word</p>
        )}
      </div>

      {/* Letter Bank */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {scrambledLetters.map((item) => (
          <button
            key={item.id}
            onClick={() => handleLetterClick(item)}
            className="w-10 h-10 md:w-12 md:h-12 bg-white text-slate-700 border-2 border-slate-200 rounded-lg shadow-sm font-bold text-xl flex items-center justify-center hover:border-sky-300 hover:text-sky-500 hover:-translate-y-1 transition"
          >
            {item.char}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={nextWord}
          className="flex items-center gap-2 px-6 py-3 bg-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-300 transition"
        >
          <RefreshCcw size={20} /> Skip
        </button>
        <button 
          onClick={checkAnswer}
          className="flex items-center gap-2 px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 hover:translate-y-0.5 transition"
        >
          <Check size={20} /> Check
        </button>
      </div>

      {message && (
        <div className={`mt-6 text-xl font-bold ${message.includes('Correct') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default GameScramble;