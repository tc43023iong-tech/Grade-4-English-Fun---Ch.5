import React, { useState, useEffect } from 'react';
import { vocabList } from '../data';
import { Shuffle, Star, Trophy, Sparkles, Brain } from 'lucide-react';

interface Card {
  id: string; 
  vocabId: number;
  content: string;
  emoji?: string; // Add emoji support for visual appeal
  type: 'english' | 'chinese';
  isFlipped: boolean;
  isMatched: boolean;
}

const GameMemory: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [moves, setMoves] = useState(0);

  const initGame = () => {
    const shuffledVocab = [...vocabList].sort(() => 0.5 - Math.random()).slice(0, 6); // 6 pairs = 12 cards (better grid 3x4 or 4x3)
    
    const gameCards: Card[] = [];
    shuffledVocab.forEach(word => {
      gameCards.push({
        id: `eng-${word.id}`,
        vocabId: word.id,
        content: word.english,
        emoji: word.emoji,
        type: 'english',
        isFlipped: false,
        isMatched: false,
      });
      gameCards.push({
        id: `chi-${word.id}`,
        vocabId: word.id,
        content: word.chinese,
        type: 'chinese',
        isFlipped: false,
        isMatched: false,
      });
    });

    setCards(gameCards.sort(() => 0.5 - Math.random()));
    setMatches(0);
    setMoves(0);
    setFlippedCards([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (clickedCard: Card) => {
    if (isLocked || clickedCard.isFlipped || clickedCard.isMatched) return;

    const newCards = cards.map(c => 
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
      setMoves(m => m + 1);
      checkForMatch(newFlipped, newCards);
    }
  };

  const checkForMatch = (currentFlipped: Card[], currentCards: Card[]) => {
    const [card1, card2] = currentFlipped;
    const isMatch = card1.vocabId === card2.vocabId;

    if (isMatch) {
      setTimeout(() => {
        setCards(currentCards.map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isMatched: true, isFlipped: true } 
            : c
        ));
        setMatches(prev => prev + 1);
        setFlippedCards([]);
        setIsLocked(false);
      }, 600);
    } else {
      setTimeout(() => {
        setCards(currentCards.map(c => 
          c.id === card1.id || c.id === card2.id 
            ? { ...c, isFlipped: false } 
            : c
        ));
        setFlippedCards([]);
        setIsLocked(false);
      }, 1000);
    }
  };

  return (
    <div className="flex flex-col items-center p-2 md:p-4 max-w-4xl mx-auto">
      {/* Header HUD */}
      <div className="flex justify-between w-full items-end mb-6 bg-white p-4 rounded-3xl shadow-sm border-2 border-slate-100">
        <div>
           <h2 className="text-2xl font-display font-bold text-violet-600 flex items-center gap-2">
             <Brain className="text-violet-400" />
             Memory Match
           </h2>
           <p className="text-slate-400 text-sm font-bold">Find matching pairs!</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-violet-50 px-4 py-2 rounded-2xl border border-violet-100 flex flex-col items-center min-w-[80px]">
             <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">Pairs</span>
             <span className="text-2xl font-display font-bold text-violet-600">{matches}/6</span>
          </div>
          <div className="bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 flex flex-col items-center min-w-[80px]">
             <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Moves</span>
             <span className="text-2xl font-display font-bold text-slate-600">{moves}</span>
          </div>
          <button 
            onClick={initGame}
            className="p-3 bg-slate-100 text-slate-500 rounded-2xl hover:bg-slate-200 hover:text-slate-700 transition active:scale-95"
            title="Restart Game"
          >
            <Shuffle size={24} />
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4 w-full perspective-1000">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="aspect-[3/4] cursor-pointer group relative"
          >
            <div className={`
              w-full h-full transition-all duration-500 transform preserve-3d
              ${card.isFlipped ? 'rotate-y-180' : ''}
              ${card.isMatched ? 'scale-95 opacity-90' : 'hover:-translate-y-1'}
            `}>
              
              {/* --- CARD BACK --- */}
              <div className="absolute w-full h-full backface-hidden rounded-2xl shadow-md overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500 border-b-4 border-violet-700 flex items-center justify-center">
                 {/* Decorative Pattern */}
                 <div className="absolute inset-2 border-2 border-white/20 border-dashed rounded-xl"></div>
                 <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/10 rounded-full blur-xl"></div>
                 <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-black/10 rounded-full blur-xl"></div>
                 
                 <Star className="text-white w-10 h-10 drop-shadow-md" fill="white" fillOpacity={0.5} />
              </div>
              
              {/* --- CARD FRONT --- */}
              <div className={`
                absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl border-b-4 flex flex-col items-center justify-center p-2 text-center shadow-lg transition-colors duration-300
                ${card.isMatched 
                  ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200' 
                  : 'bg-white border-slate-200'}
              `}>
                {card.isMatched && (
                  <div className="absolute top-2 right-2 text-emerald-400 animate-bounce">
                    <Sparkles size={16} />
                  </div>
                )}
                
                {card.type === 'english' ? (
                  <>
                    <div className="text-4xl mb-2 filter drop-shadow-sm">{card.emoji}</div>
                    <span className="font-display font-bold text-slate-700 text-sm md:text-base leading-tight">
                      {card.content}
                    </span>
                  </>
                ) : (
                  <span className="font-sans font-bold text-slate-700 text-lg md:text-xl">
                    {card.content}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Victory Overlay */}
      {matches === 6 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform animate-pop-in">
             <div className="w-24 h-24 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
               <Trophy size={48} />
             </div>
             <h3 className="text-3xl font-display font-bold text-slate-800 mb-2">Fantastic!</h3>
             <p className="text-slate-500 mb-6 font-bold">You found all pairs in {moves} moves.</p>
             <button 
               onClick={initGame}
               className="w-full py-4 bg-violet-500 hover:bg-violet-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-200 transition transform hover:scale-105"
             >
               Play Again
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameMemory;