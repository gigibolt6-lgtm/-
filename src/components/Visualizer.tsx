import React, { useState, useRef, useEffect } from 'react';
import { ThemeId } from '../types';
import { calculateMean, calculateDeviations, calculateVariance, calculateStdDev } from '../utils/stats';

interface Props {
  points: number[];
  theme: ThemeId;
  step: number;
  onPointChange: (index: number, newValue: number) => void;
}

export function Visualizer({ points, theme, step, onPointChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null);

  const width = 600;
  const height = 400;
  const padding = 60;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const maxValue = 20;

  const mean = calculateMean(points);
  const stdDev = calculateStdDev(points);

  const getX = (index: number) => padding + (index + 0.5) * (innerWidth / points.length);
  const getY = (val: number) => height - padding - (val / maxValue) * innerHeight;
  const getValFromY = (y: number) => ((height - padding - y) / innerHeight) * maxValue;

  const handlePointerDown = (e: React.PointerEvent<SVGCircleElement>, idx: number) => {
    (e.target as SVGCircleElement).setPointerCapture(e.pointerId);
    setDraggingIdx(idx);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (draggingIdx === null || !svgRef.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svgRef.current.getScreenCTM()?.inverse());
    
    let newVal = getValFromY(svgP.y);
    newVal = Math.max(0, Math.min(maxValue, Math.round(newVal)));
    
    if (points[draggingIdx] !== newVal) {
      onPointChange(draggingIdx, newVal);
    }
  };

  const handlePointerUp = () => {
    setDraggingIdx(null);
  };

  // Drawing elements based on theme and step
  const showSum = theme === 'sigma' && step >= points.length;
  const showMeanLine = (theme === 'mean' && step >= 2) || ['deviation', 'variance', 'stdDev'].includes(theme);
  const showDeviations = (theme === 'deviation' && step >= 1) || ['variance', 'stdDev'].includes(theme);
  const showVariance = theme === 'variance' && step >= 2;
  const showStdDev = theme === 'stdDev' && step >= 2;

  const highlightIndex = theme === 'sigma' && step > 0 && step <= points.length ? step - 1 : 
                         theme === 'deviation' && step > 0 && step <= points.length ? step - 1 : null;

  return (
    <div className="w-full overflow-hidden bg-white rounded-xl border border-nt-border shadow-sm relative touch-none">
      <svg 
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`} 
        className="w-full h-auto select-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F9F7F2" strokeWidth="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Y Axis Guides */}
        {[0, 5, 10, 15, 20].map((v) => (
          <g key={`guide-${v}`}>
            <line 
              x1={padding - 10} 
              y1={getY(v)} 
              x2={width - padding + 10} 
              y2={getY(v)} 
              stroke="#E5E0D5" 
              strokeWidth="1" 
              strokeDasharray={v === 0 ? "" : "4,4"} 
            />
            <text x={padding - 20} y={getY(v) + 4} textAnchor="end" fontSize="12" fill="#A68A64" className="font-mono">
              {v}
            </text>
          </g>
        ))}

        {/* X Axis */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E0D5" strokeWidth="2" />
        {points.map((_, i) => (
          <text key={`x-label-${i}`} x={getX(i)} y={height - padding + 20} textAnchor="middle" fontSize="12" fill="#A68A64" className="font-mono">
            x{i + 1}
          </text>
        ))}

        {/* Std Dev Band */}
        {showStdDev && (
          <rect
            x={padding}
            y={getY(mean + stdDev)}
            width={innerWidth}
            height={getY(mean - stdDev) - getY(mean + stdDev)}
            fill="#5A6E5D"
            fillOpacity="0.05"
          />
        )}
        {showStdDev && (
          <>
            <line x1={padding} y1={getY(mean + stdDev)} x2={width - padding} y2={getY(mean + stdDev)} stroke="#5A6E5D" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
            <line x1={padding} y1={getY(mean - stdDev)} x2={width - padding} y2={getY(mean - stdDev)} stroke="#5A6E5D" strokeWidth="1" strokeDasharray="4,4" opacity="0.5" />
            <text x={width - padding + 10} y={getY(mean + stdDev) + 4} fill="#5A6E5D" fontSize="12" className="font-mono font-bold">+1σ</text>
            <text x={width - padding + 10} y={getY(mean - stdDev) + 4} fill="#5A6E5D" fontSize="12" className="font-mono font-bold">-1σ</text>
          </>
        )}

        {/* Variance Squares */}
        {showVariance && points.map((val, i) => {
          const dev = val - mean;
          const pixelDev = getY(val) - getY(mean); // Can be negative
          const size = Math.abs(pixelDev);
          // Only show all or just the highlighted one? For variance, show all.
          // But maybe animate them? Let's show all if step >= 2
          return (
            <rect
              key={`var-${i}`}
              x={getX(i)}
              y={dev > 0 ? getY(val) : getY(mean)}
              width={size}
              height={size}
              fill="#D4A373"
              fillOpacity="0.1"
              stroke="#D4A373"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
          );
        })}

        {/* Deviations */}
        {showDeviations && points.map((val, i) => {
          if (theme === 'deviation' && step > 0 && step <= points.length && highlightIndex !== i) return null;
          return (
            <g key={`dev-${i}`}>
              <line
                x1={getX(i)}
                y1={getY(mean)}
                x2={getX(i)}
                y2={getY(val)}
                stroke={val >= mean ? "#D4A373" : "#D4A373"}
                strokeWidth="2"
                strokeDasharray="4,2"
                opacity="0.8"
              />
            </g>
          );
        })}

        {/* Mean Line */}
        {showMeanLine && (
          <g>
            <line x1={padding} y1={getY(mean)} x2={width - padding} y2={getY(mean)} stroke="#D4A373" strokeWidth="2" strokeDasharray="4,4" />
            <text x={padding - 20} y={getY(mean) - 8} fill="#D4A373" fontSize="14" className="font-bold" textAnchor="end">x̄</text>
            <text x={width - padding + 10} y={getY(mean) + 4} fill="#D4A373" fontSize="12" className="font-mono font-bold">{mean.toFixed(1)}</text>
          </g>
        )}

        {/* Data Points */}
        {points.map((val, i) => (
          <g key={`pt-${i}`}>
            <circle
              cx={getX(i)}
              cy={getY(val)}
              r={highlightIndex === i ? 8 : 6}
              fill={highlightIndex === i ? "#2F3630" : "#5A6E5D"}
              className="cursor-pointer transition-all duration-200"
              onPointerDown={(e) => handlePointerDown(e, i)}
            />
            <text 
              x={getX(i)} 
              y={getY(val) - 15} 
              textAnchor="middle" 
              fontSize="12" 
              fill={highlightIndex === i ? "#2F3630" : "#5A6E5D"} 
              className="font-mono font-bold pointer-events-none"
            >
              {val}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
