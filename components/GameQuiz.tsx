import React, { useState, useEffect, useRef } from 'react';
import { vocabList } from '../data';
import { Vocabulary } from '../types';
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react';

const GameQuiz: React.FC = () => {
  const [question, setQuestion] = useState<Vocabulary | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  // Deck to prevent repeats
  const deckRef = useRef<Vocabulary[]>([]);

  const getNextWord = () => {
    if (deckRef.current.length === 0) {
      deckRef.current = [...vocabList].sort(() => 0.5 - Math.random());
    }
    return deckRef.current.pop()!;
  };

  const generateQuestion = () => {
    const randomWord = getNextWord();
    setQuestion(randomWord);
    setSelectedOption(null);
    setIsCorrect(null);

    // Generate distractors
    const distractors = vocabList
      .filter(w => w.id !== randomWord.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.chinese);
    
    const allOptions = [...distractors, randomWord.chinese].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
  };

  useEffect(() => {
    generateQuestion();
  }, []);

  const handleOptionClick = (option: string) => {
    if (selectedOption !== null) return; // Prevent double click

    setSelectedOption(option);
    if (question && option === question.chinese) {
      setIsCorrect(true);
      setScore(s => s + 1);
      setTimeout(generateQuestion, 1500);
    } else {
      setIsCorrect(false);
      // Allow trying again logic or wait next? Let's show correct and move on.
      setTimeout(generateQuestion, 2500);
    }
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
       <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-sky-600">Quiz Master</h2>
        <div className="bg-sky-100 px-4 py-1 rounded-full text-sky-700 font-bold">
          Score: {score}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-xl text-center mb-8 border-t-8 border-sky-400 relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-sky-400 text-white p-3 rounded-full border-4 border-white">
          <HelpCircle size={32} />
        </div>
        <p className="text-slate-400 mt-4 mb-2">What does this mean?</p>
        <h3 className="text-3xl font-bold text-slate-800">{question.english}</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, idx) => {
          let btnClass = "bg-white hover:bg-slate-50 border-2 border-slate-200 text-slate-700";
          
          if (selectedOption) {
            if (option === question.chinese) {
               btnClass = "bg-emerald-100 border-emerald-400 text-emerald-800"; // Correct answer always green after choice
            } else if (selectedOption === option && !isCorrect) {
               btnClass = "bg-rose-100 border-rose-400 text-rose-800"; // Wrong selection
            } else {
               btnClass = "opacity-50 border-slate-100 text-slate-400"; // Fade others
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionClick(option)}
              className={`p-6 rounded-2xl font-bold text-lg shadow-sm transition-all duration-300 transform ${!selectedOption && 'hover:-translate-y-1 hover:shadow-md'} ${btnClass}`}
              disabled={selectedOption !== null}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selectedOption && (
        <div className="mt-8 text-center animate-fade-in">
          {isCorrect ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xl">
              <CheckCircle /> Correct! Good job!
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 text-rose-500 font-bold text-xl">
              <XCircle /> Oops! The correct answer was {question.chinese}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GameQuiz;