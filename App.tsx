import React, { useState } from 'react';
import Layout from './components/Layout';
import VocabularyView from './components/VocabularyView';
import GameScramble from './components/GameScramble';
import GameQuiz from './components/GameQuiz';
import GameBubble from './components/GameBubble';
import GameFillBlank from './components/GameFillBlank';
import { Puzzle, Type, Zap, PenTool } from 'lucide-react';
import { GameType } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'learn' | 'games'>('learn');
  const [activeGame, setActiveGame] = useState<GameType | null>(null);

  const renderGameMenu = () => (
    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in max-w-4xl mx-auto">
      <div className="col-span-full text-center mb-4">
        <h2 className="text-3xl font-display font-bold text-purple-600">Game Zone!</h2>
        <p className="text-slate-500">Choose a game to practice your new words.</p>
      </div>

      <button onClick={() => setActiveGame('scramble')} className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-orange-200 hover:border-orange-400 hover:-translate-y-1 transition group text-left">
        <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
          <Type size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Spelling Bee</h3>
        <p className="text-slate-400 text-sm">Fill in the blanks to spell correctly.</p>
      </button>

      <button onClick={() => setActiveGame('quiz')} className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-emerald-200 hover:border-emerald-400 hover:-translate-y-1 transition group text-left">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
          <Puzzle size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Quiz Master</h3>
        <p className="text-slate-400 text-sm">Multiple choice to test your meaning.</p>
      </button>

      <button onClick={() => setActiveGame('bubble')} className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-pink-200 hover:border-pink-400 hover:-translate-y-1 transition group text-left">
        <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
          <Zap size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Bubble Pop</h3>
        <p className="text-slate-400 text-sm">Pop the big bubbles quickly!</p>
      </button>

      <button onClick={() => setActiveGame('fill-blank')} className="bg-white p-6 rounded-3xl shadow-lg border-b-4 border-indigo-200 hover:border-indigo-400 hover:-translate-y-1 transition group text-left">
        <div className="w-12 h-12 bg-indigo-100 text-indigo-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition">
          <PenTool size={28} />
        </div>
        <h3 className="text-xl font-bold text-slate-700">Sentence Builder</h3>
        <p className="text-slate-400 text-sm">Complete the sentence with the right word.</p>
      </button>
    </div>
  );

  const renderGameContent = () => {
    if (!activeGame) return renderGameMenu();

    return (
      <div className="animate-fade-in">
        <button 
          onClick={() => setActiveGame(null)}
          className="mb-4 text-slate-500 hover:text-sky-500 font-bold flex items-center gap-1 px-4"
        >
          ← Back to Games
        </button>
        {activeGame === 'scramble' && <GameScramble />}
        {activeGame === 'quiz' && <GameQuiz />}
        {activeGame === 'bubble' && <GameBubble />}
        {activeGame === 'fill-blank' && <GameFillBlank />}
      </div>
    );
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={(tab) => {
        setActiveTab(tab);
        if (tab === 'learn') setActiveGame(null);
      }}
    >
      {activeTab === 'learn' ? <VocabularyView /> : renderGameContent()}
    </Layout>
  );
};

export default App;