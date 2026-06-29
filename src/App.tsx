import React, { useState } from 'react';
import { Screen, ThemeId } from './types';
import { ThemeSelector } from './components/ThemeSelector';
import { LearningScreen } from './components/LearningScreen';
import { QuizScreen } from './components/QuizScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [selectedTheme, setSelectedTheme] = useState<ThemeId | null>(null);

  const handleSelectTheme = (id: ThemeId) => {
    setSelectedTheme(id);
    setCurrentScreen('learning');
  };

  const handleStartQuiz = () => {
    setCurrentScreen('quiz');
  };

  const handleBackToMenu = () => {
    setCurrentScreen('menu');
    setSelectedTheme(null);
  };

  return (
    <div className="min-h-screen bg-nt-bg text-nt-text font-sans selection:bg-nt-tan selection:text-nt-primary-dark">
      {currentScreen === 'menu' && (
        <ThemeSelector 
          onSelectTheme={handleSelectTheme} 
          onStartQuiz={handleStartQuiz} 
        />
      )}
      
      {currentScreen === 'learning' && selectedTheme && (
        <LearningScreen 
          themeId={selectedTheme} 
          onBack={handleBackToMenu} 
        />
      )}

      {currentScreen === 'quiz' && (
        <QuizScreen 
          onBack={handleBackToMenu} 
        />
      )}
    </div>
  );
}
