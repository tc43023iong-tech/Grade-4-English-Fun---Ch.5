import React, { useState, useEffect, useRef } from 'react';
import { vocabList } from '../data';
import { Vocabulary } from '../types';
import { PenTool, CheckCircle, XCircle } from 'lucide-react';

const GameFillBlank: React.FC = () => {
  const [question, setQuestion] = useState<Vocabulary | null>(null);
  const [sentenceParts, setSentenceParts] = useState<{prefix: string, suffix: string} | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  // Store valid items once
  const [validItems] = useState(() => {
    return vocabList.map(word => {
        // Pre-calculate the match.
        const escapedWord = word.english.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedWord, 'i');
        const match = word.example.match(regex);
        
        if (match && match.index !== undefined) {
             return {
                 word: word,
                 prefix: word.example.substring(0, match.index),
                 suffix: word.example.substring(match.index + match[0].length)
             }
        }
        return null;
    }).filter(item => item !== null) as { word: Vocabulary, prefix: string, suffix: string }[];
  });

  const deckRef = useRef<number[]>([]);

  const generateQuestion = () => {
    if (validItems.length === 0) return;

    if (deckRef.current.length === 0) {
        // Refill deck with indices of validItems
        deckRef.current = validItems.map((_, index) => index).sort(() => 0.5 - Math.random());
    }

    const nextIndex = deckRef.current.pop()!;
    const item = validItems[nextIndex];
    
    setQuestion(item.word);
    setSentenceParts({ prefix: item.prefix, suffix: item.suffix });
    setSelectedOption(null);
    setIsCorrect(null);

    // Generate distractors
    const distractors = vocabList
      .filter(w => w.id !== item.word.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(w => w.english);
    
    const allOptions = [...distractors, item.word.english].sort(() => 0.5 - Math.random());
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
      setTimeout(generateQuestion, 2000);
    } else {
      setIsCorrect(false);
      setTimeout(generateQuestion, 2500);
    }
  };

  if (!question || !sentenceParts) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
       <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-display font-bold text-sky-600">Sentence Builder</h2>
        <div className="bg-sky-100 px-4 py-1 rounded-full text-sky-700 font-bold">
          Score: {score}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl text-center mb-8 border-t-8 border-indigo-400 relative">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-indigo-400 text-white p-3 rounded-full border-4 border-white">
          <PenTool size={32} />
        </div>
        
        <p className="text-slate-400 mt-4 mb-6 text-sm font-bold uppercase tracking-widest">Complete the Sentence</p>
        
        <div className="text-2xl md:text-4xl font-bold text-slate-700 leading-relaxed">
          <span>{sentenceParts.prefix}</span>
          <span className="inline-block border-b-4 border-indigo-300 min-w-[150px] mx-2 px-2 text-indigo-600">
            {selectedOption ? selectedOption : "?"}
          </span>
          <span>{sentenceParts.suffix}</span>
        </div>

        {question.emoji && <div className="text-7xl mt-8">{question.emoji}</div>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className={`p-6 rounded-xl font-bold text-xl shadow-sm transition-all duration-300 flex items-center justify-center gap-3 ${!selectedOption && 'hover:-translate-y-1 hover:shadow-md'} ${btnClass}`}
              disabled={selectedOption !== null}
            >
              {option}
              {selectedOption && option === question.english && <CheckCircle size={24}/>}
              {selectedOption === option && !isCorrect && <XCircle size={24}/>}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameFillBlank;