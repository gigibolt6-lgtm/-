import React, { useState } from 'react';
import { ThemeId, THEMES } from '../types';
import { Visualizer } from './Visualizer';
import { Formula } from './Formula';
import { calculateMean, calculateSum, calculateVariance, calculateStdDev } from '../utils/stats';
import { ArrowLeft, ChevronRight, ChevronLeft, RotateCcw, Plus, Minus } from 'lucide-react';

interface Props {
  themeId: ThemeId;
  onBack: () => void;
}

export function LearningScreen({ themeId, onBack }: Props) {
  const themeDef = THEMES.find(t => t.id === themeId)!;
  const [points, setPoints] = useState<number[]>([3, 5, 8, 10, 12]);
  const [step, setStep] = useState<number>(0);

  const n = points.length;
  
  // Define max steps per theme
  const maxSteps: Record<ThemeId, number> = {
    sigma: n + 1,
    mean: 3,
    deviation: n + 1,
    variance: 4,
    stdDev: 3
  };

  const handleNextStep = () => {
    if (step < maxSteps[themeId]) setStep(s => s + 1);
  };

  const handlePrevStep = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handlePointChange = (idx: number, val: number) => {
    const newPoints = [...points];
    newPoints[idx] = val;
    setPoints(newPoints);
  };

  const addPoint = () => {
    if (points.length < 8) {
      setPoints([...points, 5]);
      setStep(0);
    }
  };

  const removePoint = () => {
    if (points.length > 3) {
      setPoints(points.slice(0, -1));
      setStep(0);
    }
  };

  // Generate formula and explanation based on theme and step
  const renderFormulaAndText = () => {
    let math = '';
    let explanation = '';

    if (themeId === 'sigma') {
      if (step === 0) {
        math = '\\sum_{i=1}^{n} x_i';
        explanation = 'Σ（シグマ）は「すべて足し合わせる」という意味です。';
      } else if (step <= n) {
        math = `x_${step} = ${points[step - 1]}`;
        explanation = `${step}番目のデータを確認しています。`;
      } else {
        math = `\\sum_{i=1}^{${n}} x_i = ${calculateSum(points)}`;
        explanation = 'すべてのデータを足し合わせました。';
      }
    } else if (themeId === 'mean') {
      if (step === 0) {
        math = '\\bar{x} = \\frac{\\sum_{i=1}^{n} x_i}{n}';
        explanation = '平均（x̄ または μ）は、合計を個数で割ったものです。';
      } else if (step === 1) {
        math = `\\sum x_i = ${calculateSum(points)}`;
        explanation = 'まず、すべてのデータを足し合わせます。';
      } else if (step === 2) {
        math = `\\bar{x} = \\frac{${calculateSum(points)}}{${n}} = ${calculateMean(points).toFixed(1)}`;
        explanation = '合計を個数で割り、平らにならした値が「平均」です。';
      } else if (step === 3) {
        math = `\\mu = ${calculateMean(points).toFixed(1)}`;
        explanation = '平均線が引かれました。データ全体の重心のようなものです。';
      }
    } else if (themeId === 'deviation') {
      const mean = calculateMean(points);
      if (step === 0) {
        math = 'x_i - \\bar{x}';
        explanation = '偏差とは、各データが平均からどれだけ離れているかを表します。';
      } else if (step <= n) {
        const val = points[step - 1];
        const dev = val - mean;
        math = `${val} - ${mean.toFixed(1)} = ${dev > 0 ? '+' : ''}${dev.toFixed(1)}`;
        explanation = `${step}番目のデータの偏差です。${dev > 0 ? '平均より大きい' : '平均より小さい'}ですね。`;
      } else {
        math = '\\sum (x_i - \\bar{x}) = 0';
        explanation = 'すべての偏差を足すと、必ず0になります。';
      }
    } else if (themeId === 'variance') {
      if (step === 0) {
        math = 's^2 = \\frac{\\sum (x_i - \\bar{x})^2}{n}';
        explanation = '分散は、データのばらつきを表す指標です。偏差を2乗します。';
      } else if (step === 1) {
        math = '(x_i - \\bar{x})';
        explanation = '偏差をそのまま足すと0になるため、ばらつきを測れません。';
      } else if (step === 2) {
        math = '(x_i - \\bar{x})^2';
        explanation = 'そこで偏差を2乗します。視覚的には「正方形の面積」になります。';
      } else if (step === 3) {
        math = 's^2 = ' + calculateVariance(points).toFixed(2);
        explanation = '正方形の面積の「平均」が分散です。すべて正の値として評価できます。';
      } else if (step === 4) {
        math = 's^2 = ' + calculateVariance(points).toFixed(2);
        explanation = '分散が大きいほど、面積が大きく（ばらつきが大きく）なります。データ点を動かして確認しましょう。';
      }
    } else if (themeId === 'stdDev') {
      const v = calculateVariance(points);
      const s = calculateStdDev(points);
      if (step === 0) {
        math = 's = \\sqrt{s^2}';
        explanation = '標準偏差は、分散の平方根をとったものです。';
      } else if (step === 1) {
        math = `s^2 = ${v.toFixed(2)}`;
        explanation = '分散は「面積」なので、単位が元のデータと異なってしまいます。';
      } else if (step === 2) {
        math = `s = \\sqrt{${v.toFixed(2)}} = ${s.toFixed(2)}`;
        explanation = '平方根をとることで、元のデータと同じ単位（距離）に戻します。';
      } else if (step === 3) {
        math = `\\pm 1\\sigma`;
        explanation = '青い帯が ±1標準偏差 の範囲です。標準的なばらつきの幅を示しています。';
      }
    }

    return { math, explanation };
  };

  const { math, explanation } = renderFormulaAndText();

  return (
    <div className="max-w-5xl mx-auto py-6 px-4 flex flex-col h-[100dvh]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-nt-text opacity-60 hover:opacity-100 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>戻る</span>
        </button>
        <h1 className="text-2xl font-bold text-nt-primary-dark">{themeDef.title}</h1>
        <div className="w-20" /> {/* Spacer for centering */}
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Left Column: Math & Steps */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="bg-nt-light rounded-xl p-6 border border-nt-border flex-1 flex flex-col justify-center items-center text-center">
            <h2 className="text-sm font-bold text-nt-gold-dark mb-4 uppercase tracking-widest">Formula</h2>
            <div className="text-nt-text">
              <Formula math={math} block />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border-l-4 border-nt-gold border-y border-r border-y-nt-border border-r-nt-border shadow-sm flex-1 flex flex-col justify-center">
            <h2 className="text-sm font-bold text-nt-gold mb-2 uppercase tracking-widest">Explanation</h2>
            <p className="text-nt-text opacity-80 leading-relaxed text-sm">
              {explanation}
            </p>
          </div>
        </div>

        {/* Right Column: Visualizer & Controls */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative">
            <Visualizer 
              points={points} 
              theme={themeId} 
              step={step} 
              onPointChange={handlePointChange} 
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={removePoint} 
                disabled={points.length <= 3}
                className="w-10 h-10 rounded-full border border-nt-border flex items-center justify-center hover:bg-nt-tan bg-white shadow-sm text-nt-text disabled:opacity-50 transition-colors"
                title="データ削除"
              >
                <Minus size={18} />
              </button>
              <button 
                onClick={addPoint} 
                disabled={points.length >= 8}
                className="w-10 h-10 rounded-full border border-nt-border flex items-center justify-center hover:bg-nt-tan bg-white shadow-sm text-nt-text disabled:opacity-50 transition-colors"
                title="データ追加"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
              <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs text-nt-text opacity-70 font-medium">
                データ点を上下にドラッグできます
              </span>
            </div>
          </div>

          {/* Stepper Controls */}
          <div className="bg-white rounded-xl p-4 border border-nt-border flex items-center justify-between shadow-sm">
            <button 
              onClick={() => setStep(0)}
              className="p-2 text-nt-text opacity-50 hover:opacity-100 transition-colors"
              title="最初から"
            >
              <RotateCcw size={20} />
            </button>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrevStep}
                disabled={step === 0}
                className="flex items-center gap-1 px-4 py-2 bg-nt-tan text-nt-text rounded-full disabled:opacity-50 hover:bg-nt-border transition-colors font-medium text-sm"
              >
                <ChevronLeft size={18} />
                前へ
              </button>
              <div className="text-sm font-medium text-nt-gold-dark w-16 text-center">
                {step} / {maxSteps[themeId]}
              </div>
              <button 
                onClick={handleNextStep}
                disabled={step === maxSteps[themeId]}
                className="flex items-center gap-1 px-4 py-2 bg-nt-primary text-white rounded-full disabled:opacity-50 hover:bg-nt-primary-dark transition-colors font-medium text-sm shadow-md"
              >
                次へ
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
