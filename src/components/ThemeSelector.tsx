import React from 'react';
import { THEMES, ThemeId } from '../types';
import { BookOpen, HelpCircle } from 'lucide-react';

interface Props {
  onSelectTheme: (id: ThemeId) => void;
  onStartQuiz: () => void;
}

export function ThemeSelector({ onSelectTheme, onStartQuiz }: Props) {
  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-nt-primary-dark mb-4 tracking-tight">統計ビジュアル学習</h1>
        <p className="text-nt-text opacity-80 text-lg">数式を視覚的に理解しよう</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onSelectTheme(theme.id)}
            className="flex flex-col items-start p-6 bg-white border border-nt-border rounded-xl shadow-sm hover:shadow-md hover:border-nt-gold transition-all text-left"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-nt-tan text-nt-primary-dark rounded-lg">
                <BookOpen size={20} />
              </div>
              <h2 className="text-xl font-semibold text-nt-text">{theme.title}</h2>
            </div>
            <p className="text-nt-text opacity-70">{theme.description}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onStartQuiz}
          className="flex items-center gap-2 px-8 py-4 bg-nt-primary text-white rounded-xl font-medium shadow-sm hover:bg-nt-primary-dark transition-colors"
        >
          <HelpCircle size={20} />
          確認クイズに挑戦
        </button>
      </div>
    </div>
  );
}
