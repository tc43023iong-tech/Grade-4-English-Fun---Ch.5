import React, { useState, useEffect } from 'react';
import { vocabList } from '../data';
import { Vocabulary } from '../types';
import { Volume2, Ear, CheckCircle, XCircle } from 'lucide-react';

const GameListen: React.FC = () => {
  const [question, setQuestion] = useState<Vocabulary | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-GB'; 
    window.speechSynthesis.speak(utterance);
  };

  const generateQuestion = () => {
    const randomWord = vocabList[Math.floor(Math.random() * vocabList.length)];
    setQuestion(randomWord);
    setSelectedOption(null);
    setIsCorrect(null);

    // Generate distractors (English words)
    const distractors = vocabList
      .filter(w => w.id !== randomWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2) // 3 options total
      .map(w => w.english);
    
    const allOptions = [...distractors, randomWord.english].sort(() => 0.5 - Math.random());
    setOptions(allOptions);

    // Play sound automatically after a short delay
    setTimeout(() => speak(randomWord.english), 300);
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
        <h2 className="text-2xl font-display font-bold text-sky-600">Listen Up</h2>
        <div className="bg-sky-100 px-4 py-1 rounded-full text-sky-700 font-bold">
          Score: {score}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-12 shadow-xl text-center mb-8 border-b-8 border-purple-300">
        <div className="mb-6 flex justify-center">
             <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center text-purple-500">
                 <Ear size={40} />
             </div>
        </div>
        
        <p className="text-slate-400 mb-6 font-bold text-lg">Tap to listen again!</p>
        
        <button 
          onClick={() => speak(question.english)}
          className="bg-purple-500 hover:bg-purple-600 text-white rounded-full p-8 shadow-lg transform hover:scale-105 transition-all active:scale-95"
        >
          <Volume2 size={64} />
        </button>
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
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameListen;