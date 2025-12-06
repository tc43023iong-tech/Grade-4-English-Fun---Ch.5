import React, { useState, useEffect } from 'react';
import { vocabList } from '../data';
import { Shuffle } from 'lucide-react';

interface Card {
  id: string; // Unique ID for the card instance
  vocabId: number;
  content: string;
  type: 'english' | 'chinese';
  isFlipped: boolean;
  isMatched: boolean;
}

const GameMemory: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  // Initialize game with a subset of cards
  const initGame = () => {
    // Pick 8 random words
    const shuffledVocab = [...vocabList].sort(() => 0.5 - Math.random()).slice(0, 8);
    
    const gameCards: Card[] = [];
    shuffledVocab.forEach(word => {
      gameCards.push({
        id: `eng-${word.id}`,
        vocabId: word.id,
        content: word.english,
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
    setFlippedCards([]);
    setIsLocked(false);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardClick = (clickedCard: Card) => {
    if (isLocked || clickedCard.isFlipped || clickedCard.isMatched) return;

    // Flip the clicked card
    const newCards = cards.map(c => 
      c.id === clickedCard.id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, clickedCard];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setIsLocked(true);
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
      }, 500);
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
    <div className="flex flex-col items-center p-4">
      <div className="flex justify-between w-full max-w-4xl mb-6 items-center">
        <div>
           <h2 className="text-2xl font-display font-bold text-sky-600">Memory Match</h2>
           <p className="text-slate-500">Find the pairs!</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-4 py-2 rounded-xl shadow font-bold text-slate-700">
            Pairs: {matches}/8
          </div>
          <button 
            onClick={initGame}
            className="p-2 bg-sky-100 text-sky-600 rounded-full hover:bg-sky-200 transition"
          >
            <Shuffle size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 md:gap-4 w-full max-w-4xl">
        {cards.map(card => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`
              aspect-[4/3] cursor-pointer relative perspective-1000 group
            `}
          >
            <div className={`
              w-full h-full transition-all duration-500 transform preserve-3d
              ${card.isFlipped ? 'rotate-y-180' : ''}
            `}>
              {/* Back of Card */}
              <div className="absolute w-full h-full backface-hidden bg-sky-200 rounded-xl border-b-4 border-sky-300 flex items-center justify-center shadow-sm">
                <span className="text-sky-400 text-4xl font-display">?</span>
              </div>
              
              {/* Front of Card */}
              <div className={`
                absolute w-full h-full backface-hidden rotate-y-180 rounded-xl border-b-4 flex items-center justify-center p-2 text-center shadow-sm
                ${card.isMatched 
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800' 
                  : 'bg-white border-slate-200 text-slate-800'}
              `}>
                <span className={`font-bold ${card.content.length > 15 ? 'text-sm' : 'text-base md:text-lg'}`}>
                  {card.content}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {matches === 8 && (
        <div className="mt-8 bg-yellow-100 text-yellow-800 px-6 py-4 rounded-2xl font-bold text-xl animate-bounce">
          🎉 Fantastic Job! You matched all pairs!
        </div>
      )}
    </div>
  );
};

export default GameMemory;