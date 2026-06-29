import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'すべての偏差を合計すると、値はいくつになるでしょうか？',
    options: ['1', '0', '平均と同じ値', 'データの個数と同じ値'],
    correct: 1,
    explanation: '平均からのプラスのズレとマイナスのズレが打ち消し合うため、偏差の合計は常に0になります。'
  },
  {
    id: 2,
    question: '分散を求める際、なぜ偏差を2乗するのでしょうか？',
    options: ['計算が簡単になるから', '単位を揃えるため', 'プラスの値にして打ち消し合いを防ぐため', '値を大きく見せるため'],
    correct: 2,
    explanation: '偏差をそのまま足すと0になってしまうため、2乗してすべてプラス（面積）にしてから平均をとります。'
  },
  {
    id: 3,
    question: '標準偏差は分散とどのような関係がありますか？',
    options: ['分散を2倍したもの', '分散の平方根をとったもの', '分散から平均を引いたもの', '全く関係ない'],
    correct: 1,
    explanation: '分散は2乗されているため単位が変わっています。元の単位に戻すために平方根をとったものが標準偏差です。'
  }
];

export function QuizScreen({ onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = QUIZ_QUESTIONS[currentQ];
  const isFinished = currentQ >= QUIZ_QUESTIONS.length;

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
    if (index === question.correct) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    setCurrentQ(q => q + 1);
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <h1 className="text-3xl font-bold text-nt-primary-dark mb-6">クイズ完了！</h1>
        <div className="text-6xl mb-6">🎉</div>
        <p className="text-2xl text-nt-text opacity-80 mb-8">
          全 {QUIZ_QUESTIONS.length} 問中 <span className="font-bold text-nt-primary text-3xl">{score}</span> 問正解
        </p>
        <button 
          onClick={onBack}
          className="px-8 py-3 bg-nt-primary text-white rounded-xl font-medium shadow-sm hover:bg-nt-primary-dark transition-colors"
        >
          ホームに戻る
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 flex flex-col h-[100dvh]">
      <div className="flex items-center mb-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-nt-text opacity-60 hover:opacity-100 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>
        <div className="flex-1 text-center font-bold text-nt-gold-dark uppercase tracking-widest text-xs">
          Question {currentQ + 1} of {QUIZ_QUESTIONS.length}
        </div>
        <div className="w-16" />
      </div>

      <div className="bg-white rounded-2xl p-8 border border-nt-border shadow-sm mb-8 flex-1">
        <h2 className="text-2xl font-bold text-nt-text mb-8 leading-relaxed">
          {question.question}
        </h2>

        <div className="flex flex-col gap-4">
          {question.options.map((opt, i) => {
            const isSelected = selectedOption === i;
            const isCorrect = i === question.correct;
            
            let btnClass = "text-left p-4 rounded-xl border-2 transition-all font-medium text-lg ";
            
            if (!showResult) {
              btnClass += "border-nt-border hover:border-nt-gold hover:bg-nt-tan text-nt-text";
            } else if (isCorrect) {
              btnClass += "border-[#5A6E5D] bg-[#F2EDE4] text-[#2F3630]";
            } else if (isSelected && !isCorrect) {
              btnClass += "border-[#D4A373] bg-[#FDFCF8] text-[#D4A373]";
            } else {
              btnClass += "border-nt-border bg-nt-light text-nt-text opacity-50";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showResult}
                className={btnClass}
              >
                <div className="flex items-center justify-between">
                  <span>{opt}</span>
                  {showResult && isCorrect && <CheckCircle2 className="text-[#5A6E5D]" />}
                  {showResult && isSelected && !isCorrect && <XCircle className="text-[#D4A373]" />}
                </div>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className="mt-8 p-6 bg-nt-tan rounded-xl border border-nt-border">
            <h3 className="font-bold text-nt-primary-dark mb-2">解説</h3>
            <p className="text-nt-text opacity-80 leading-relaxed">{question.explanation}</p>
          </div>
        )}
      </div>

      {showResult && (
        <div className="flex justify-end pb-8">
          <button 
            onClick={handleNext}
            className="px-8 py-3 bg-nt-primary text-white rounded-xl font-medium shadow-sm hover:bg-nt-primary-dark transition-colors"
          >
            次の問題へ
          </button>
        </div>
      )}
    </div>
  );
}
