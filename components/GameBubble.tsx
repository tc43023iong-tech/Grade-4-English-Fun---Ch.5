import React, { useState, useEffect, useRef } from 'react';
import { vocabList } from '../data';
import { Vocabulary } from '../types';
import { Play, Pause } from 'lucide-react';

interface Bubble {
  id: number;
  word: Vocabulary;
  x: number;
  y: number;
  speed: number;
}

const GameBubble: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [target, setTarget] = useState<Vocabulary | null>(null);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const requestRef = useRef<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastSpawnTime = useRef<number>(0);

  // Bag for random selection to ensure coverage before repeat
  const bubbleBagRef = useRef<Vocabulary[]>([]);

  const getNextFromBag = () => {
    if (bubbleBagRef.current.length === 0) {
      bubbleBagRef.current = [...vocabList].sort(() => 0.5 - Math.random());
    }
    return bubbleBagRef.current.pop()!;
  };

  // Helper to get a word to spawn. 
  const getWordToSpawn = (currentTarget: Vocabulary | null): Vocabulary => {
    // 40% chance to spawn the target word if it's set
    if (currentTarget && Math.random() < 0.4) {
      return currentTarget;
    }
    // Otherwise pull from bag
    return getNextFromBag();
  };

  const spawnBubble = (currentTarget: Vocabulary | null) => {
    const word = getWordToSpawn(currentTarget);
    const id = Date.now() + Math.random();
    
    setBubbles(prev => [
      ...prev,
      {
        id,
        word: word,
        x: Math.random() * 80 + 10, // 10% to 90% width
        y: 110, // Start below screen
        // Faster speed: 0.2 to 0.5 percent per frame
        speed: Math.random() * 0.3 + 0.2 
      }
    ]);
  };

  const updateGame = (time: number) => {
    if (!isPlaying) return;

    // Spawn bubbles much faster: every 0.8 seconds
    if (time - lastSpawnTime.current > 800) {
      spawnBubble(targetRef.current);
      lastSpawnTime.current = time;
    }

    setBubbles(prev => {
      // Move bubbles up
      const moved = prev.map(b => ({ ...b, y: b.y - b.speed }));
      // Remove bubbles that went off top
      return moved.filter(b => b.y > -20);
    });

    requestRef.current = requestAnimationFrame(updateGame);
  };

  // Ref to keep track of target inside the animation loop
  const targetRef = useRef<Vocabulary | null>(null);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  useEffect(() => {
    if (isPlaying) {
      if (!target) {
        // Initial target
        const newTarget = vocabList[Math.floor(Math.random() * vocabList.length)];
        setTarget(newTarget);
        targetRef.current = newTarget;
      }
      requestRef.current = requestAnimationFrame(updateGame);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying]);

  const handleBubbleClick = (bubble: Bubble) => {
    if (!target) return;

    if (bubble.word.id === target.id) {
      setScore(s => s + 10);
      // Change target - pick random but different from current if possible
      let newTarget = vocabList[Math.floor(Math.random() * vocabList.length)];
      if (vocabList.length > 1) {
          while(newTarget.id === target.id) {
            newTarget = vocabList[Math.floor(Math.random() * vocabList.length)];
          }
      }
      setTarget(newTarget);
      // Remove clicked bubble
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    } else {
      setScore(s => Math.max(0, s - 5));
      // Remove wrong bubble to clear clutter
      setBubbles(prev => prev.filter(b => b.id !== bubble.id));
    }
  };

  return (
    <div className="w-full h-[600px] flex flex-col bg-sky-50 rounded-3xl overflow-hidden relative border-4 border-sky-200">
      <div className="bg-white p-4 shadow-sm z-10 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-slate-700">Bubble Pop</h2>
          <p className="text-sm text-slate-400">Pop the bubble matching the word!</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-2xl font-bold text-sky-500">{score} pts</div>
           <button 
             onClick={() => setIsPlaying(!isPlaying)}
             className={`p-3 rounded-full text-white ${isPlaying ? 'bg-amber-400' : 'bg-emerald-500'}`}
           >
             {isPlaying ? <Pause /> : <Play />}
           </button>
        </div>
      </div>

      <div className="bg-sky-600 text-white p-4 text-center text-xl font-bold z-10 shadow-md">
        {isPlaying && target ? (
          <span>Find: <span className="text-yellow-300 text-2xl mx-2">{target.chinese}</span> {target.emoji}</span>
        ) : (
          <span>Press Play to Start!</span>
        )}
      </div>

      <div ref={containerRef} className="flex-1 relative overflow-hidden bg-gradient-to-b from-sky-100 to-white">
        {bubbles.map(bubble => (
          <div
            key={bubble.id}
            onClick={() => handleBubbleClick(bubble)}
            style={{ 
              left: `${bubble.x}%`, 
              top: `${bubble.y}%`,
            }}
            className="absolute transform -translate-x-1/2 cursor-pointer transition-transform hover:scale-110 active:scale-95"
          >
            {/* BIGGER BUBBLE, BIGGER TEXT, NO EMOJI */}
            <div className="w-32 h-32 rounded-full bg-white/95 backdrop-blur-sm border-2 border-sky-300 flex items-center justify-center p-2 text-center shadow-lg hover:bg-sky-50 group">
               <div className="flex flex-col items-center justify-center h-full w-full">
                 <span className="text-xl md:text-2xl font-bold text-sky-800 break-words leading-tight px-1 group-hover:scale-110 transition-transform">
                  {bubble.word.english}
                 </span>
               </div>
            </div>
            {/* Glossy reflection */}
            <div className="absolute top-5 right-5 w-6 h-6 bg-white rounded-full opacity-60"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBubble;