import React, { useState, useEffect, useRef } from 'react';
import { vocabList } from '../data';
import { Vocabulary } from '../types';
import { CheckCircle, XCircle } from 'lucide-react';

const GameEmoji: React.FC = () => {
  const [question, setQuestion] = useState<Vocabulary | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  // Filter list to only items with emojis
  const [validVocab] = useState(() => vocabList.filter(w => w.emoji && w.emoji.trim() !== ''));
  const deckRef = useRef<Vocabulary[]>([]);

  const getNextWord = () => {
    if (validVocab.length === 0) return null;
    
    if (deckRef.current.length === 0) {
      deckRef.current = [...validVocab].sort(() => 0.5 - Math.random());
    }
    return deckRef.current.pop();
  };

  const generateQuestion = () => {
    const randomWord = getNextWord();
    if (!randomWord) return;

    setQuestion(randomWord);
    setSelectedOption(null);
    setIsCorrect(null);

    // Generate distractors
    const distractors = validVocab
      .filter(w => w.id !== randomWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2) 
      .map(w => w.english);
    
    const allOptions = [...distractors, randomWord.english].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return;

    setSelectedOption(option);
    if (question && option === question.english) {
      setIsCorrect(true);
      setScore(s => s + 1);
      setTimeout(generateQuestion, 1500);
    } else {
      setIsCorrect(false);
      setTimeout(generateQuestion, 2000);
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
       <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-sky-600">Emoji Detector</h2>
        <div className="bg-sky-100 px-4 py-1 rounded-full text-sky-700 font-bold">
          Score: {score}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-12 shadow-xl text-center mb-8 border-b-8 border-orange-300 relative overflow-hidden group hover:border-orange-400 transition-colors">
        <div className="absolute top-0 left-0 w-full h-2 bg-orange-100"></div>
        
        <p className="text-slate-400 mb-4 font-bold text-sm tracking-widest uppercase">What is this?</p>
        <div className="text-9xl mb-4 transform group-hover:scale-110 transition-transform duration-500 cursor-default">
          {question.emoji}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option, idx) => {
          let btnClass = "bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700";
          
          if (selectedOption) {
            if (option === question.english) {
               btnClass = "bg-emerald-100 border-emerald-400 text-emerald-800";
            } else if (selectedOption === option && !isCorrect) {
               btnClass = "bg-rose-100 border-rose-400 text-rose-800";
            } else {
               btnClass = "opacity-50 border-slate-100 text-slate-400";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`p-6 rounded-2xl font-bold text-lg shadow-sm transition-all duration-300 flex flex-col items-center justify-center gap-2 ${!selectedOption && 'hover:-translate-y-1 hover:shadow-md'} ${btnClass}`}
              disabled={selectedOption !== null}
            >
              {option}
              {selectedOption && option === question.english && <CheckCircle size={20} className="text-emerald-600"/>}
              {selectedOption === option && !isCorrect && <XCircle size={20} className="text-rose-500"/>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameEmoji;