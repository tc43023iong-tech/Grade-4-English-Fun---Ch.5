export interface Vocabulary {
  id: number;
  english: string;
  chinese: string;
  ipa: string;
  example: string;
  category?: 'technology' | 'place' | 'story' | 'other';
  emoji?: string;
}

export type GameType = 'study' | 'scramble' | 'quiz' | 'bubble' | 'fill-blank';

export interface GameState {
  score: number;
  completed: boolean;
}