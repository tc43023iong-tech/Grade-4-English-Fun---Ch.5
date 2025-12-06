import React, { useState, useEffect } from 'react';
import { vocabList } from '../data';
import { Vocabulary } from '../types';
import { Cloud, CloudRain } from 'lucide-react';

const GameHangman: React.FC = () => {
  const [word, setWord] = useState<Vocabulary | null>(null);
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set());
  const [mistakes, setMistakes] = useState(0);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const MAX_MISTAKES = 6;
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const initGame = () => {
    const randomWord = vocabList[Math.floor(Math.random() * vocabList.length)];
    setWord(randomWord);
    setGuessedLetters(new Set());
    setMistakes(0);
    setStatus('playing');
  };

  useEffect(() => {
    initGame();
  }, []);

  const guess = (char: string) => {
    if (status !== 'playing' || guessedLetters.has(char)) return;

    const newGuessed = new Set(guessedLetters);
    newGuessed.add(char);
    setGuessedLetters(newGuessed);

    if (word && !word.english.toLowerCase().includes(char)) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= MAX_MISTAKES) setStatus('lost');
    } else if (word) {
      // Check win
      const cleanWord = word.english.toLowerCase().replace(/[^a-z]/g, ''); // ignore spaces/hyphens for check
      const allGuessed = cleanWord.split('').every(c => newGuessed.has(c));
      if (allGuessed) setStatus('won');
    }
  };

  if (!word) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4 flex flex-col items-center">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-display font-bold text-sky-600 mb-2">Cloud Pop Guessing</h2>
        <p className="text-slate-500">Guess the letters before the storm comes!</p>
      </div>

      <div className="flex gap-2 mb-8 text-sky-400">
        {[...Array(MAX_MISTAKES)].map((_, i) => (
          <div key={i}>
            {i < mistakes ? <CloudRain className="text-slate-400" /> : <Cloud fill="currentColor" />}
          </div>
        ))}
      </div>

      <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-sky-100 w-full text-center mb-8">
         <p className="text-lg text-slate-500 font-bold mb-4">{word.chinese}</p>
         <div className="flex flex-wrap justify-center gap-2">
           {word.english.split('').map((char, index) => {
             const isLetter = /[a-zA-Z]/.test(char);
             const isGuessed = guessedLetters.has(char.toLowerCase());
             
             return (
               <div key={index} className="flex flex-col items-center gap-1">
                 <span className={`w-8 text-2xl font-bold ${isLetter && !isGuessed && status === 'playing' ? 'opacity-0' : 'opacity-100 text-slate-800'}`}>
                   {isLetter && !isGuessed && status === 'lost' ? <span className="text-rose-400">{char}</span> : char}
                 </span>
                 <div className={`h-1 w-8 ${char === ' ' ? 'bg-transparent' : 'bg-slate-300'}`}></div>
               </div>
             );
           })}
         </div>
      </div>

      {status === 'playing' && (
        <div className="flex flex-wrap justify-center gap-2 max-w-xl">
          {alphabet.map(letter => {
             const isGuessed = guessedLetters.has(letter);
             const isCorrect = word.english.toLowerCase().includes(letter);
             
             let btnClass = "bg-white hover:bg-sky-50 text-sky-600 border-sky-200";
             if (isGuessed) {
               if (isCorrect) btnClass = "bg-emerald-100 border-emerald-300 text-emerald-600 cursor-not-allowed";
               else btnClass = "bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed";
             }

             return (
              <button
                key={letter}
                onClick={() => guess(letter)}
                disabled={isGuessed}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-xl font-bold text-xl border-b-4 transition-all ${btnClass}`}
              >
                {letter}
              </button>
             )
          })}
        </div>
      )}

      {status !== 'playing' && (
        <div className="text-center animate-bounce">
          <div className={`text-2xl font-bold mb-4 ${status === 'won' ? 'text-emerald-500' : 'text-slate-500'}`}>
            {status === 'won' ? 'Awesome! You got it!' : 'Rainy day... try again!'}
          </div>
          <button 
            onClick={initGame}
            className="bg-sky-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-sky-600 transition"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default GameHangman;