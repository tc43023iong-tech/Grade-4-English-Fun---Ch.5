import React from 'react';
import { BookOpen, Gamepad2 } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'learn' | 'games';
  onTabChange: (tab: 'learn' | 'games') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen font-sans text-slate-700 pb-20 md:pb-0">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-sky-400 rounded-xl flex items-center justify-center text-white font-display font-bold text-xl">
              G4
            </div>
            <h1 className="font-display font-bold text-xl text-slate-700 hidden sm:block">
              English Fun <span className="text-sky-400">Chapter 5</span>
            </h1>
          </div>

          <nav className="flex gap-2">
            <button
              onClick={() => onTabChange('learn')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                activeTab === 'learn' 
                  ? 'bg-sky-100 text-sky-600' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <BookOpen size={20} />
              <span className="hidden sm:inline">Learn Words</span>
            </button>
            <button
              onClick={() => onTabChange('games')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
                activeTab === 'games' 
                  ? 'bg-purple-100 text-purple-600' 
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              <Gamepad2 size={20} />
              <span className="hidden sm:inline">Play Games</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6">
        {children}
      </main>
      
      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-2 flex justify-around z-50">
          <button 
             onClick={() => onTabChange('learn')}
             className={`flex flex-col items-center p-2 rounded-lg w-full ${activeTab === 'learn' ? 'text-sky-500' : 'text-slate-400'}`}
          >
             <BookOpen />
             <span className="text-xs font-bold">Learn</span>
          </button>
          <button 
             onClick={() => onTabChange('games')}
             className={`flex flex-col items-center p-2 rounded-lg w-full ${activeTab === 'games' ? 'text-purple-500' : 'text-slate-400'}`}
          >
             <Gamepad2 />
             <span className="text-xs font-bold">Games</span>
          </button>
      </div>
    </div>
  );
};

export default Layout;