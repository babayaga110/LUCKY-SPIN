
import React, { useMemo } from 'react';
import { WheelSegment } from '../types';

interface SpinWheelProps {
  segments: WheelSegment[];
  rotation: number;
  isSpinning: boolean;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ segments, rotation, isSpinning }) => {
  const size = 600; // Increased base size for higher fidelity
  const radius = size / 2;
  const cx = radius;
  const cy = radius;

  const segmentPaths = useMemo(() => {
    const totalSegments = segments.length;
    const angleStep = 360 / totalSegments;

    return segments.map((segment, index) => {
      const startAngleDeg = index * angleStep - 90;
      const endAngleDeg = (index + 1) * angleStep - 90;

      const startAngleRad = (startAngleDeg * Math.PI) / 180;
      const endAngleRad = (endAngleDeg * Math.PI) / 180;

      const x1 = cx + radius * Math.cos(startAngleRad);
      const y1 = cy + radius * Math.sin(startAngleRad);
      const x2 = cx + radius * Math.cos(endAngleRad);
      const y2 = cy + radius * Math.sin(endAngleRad);

      const largeArcFlag = angleStep > 180 ? 1 : 0;

      const pathData = `
        M ${cx} ${cy}
        L ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
        Z
      `;

      // Label positioning
      const labelAngleRad = startAngleRad + (endAngleRad - startAngleRad) / 2;
      const labelRadius = radius * 0.65;
      const lx = cx + labelRadius * Math.cos(labelAngleRad);
      const ly = cy + labelRadius * Math.sin(labelAngleRad);
      
      const textRotation = (labelAngleRad * 180) / Math.PI + 90;

      return {
        pathData,
        color: segment.color,
        text: segment.text,
        lx,
        ly,
        textRotation,
        id: segment.id
      };
    });
  }, [segments, cx, cy, radius]);

  return (
    <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 5s cubic-bezier(0.15, 0, 0.1, 1)' : 'none',
        }}
      >
        <defs>
          {segments.map((seg, i) => (
            <radialGradient key={`grad-${seg.id}`} id={`grad-${seg.id}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" style={{ stopColor: seg.color, stopOpacity: 0.9 }} />
              <stop offset="100%" style={{ stopColor: seg.color, stopOpacity: 1 }} />
            </radialGradient>
          ))}
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
            <feOffset dx="2" dy="2" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {segmentPaths.map((seg) => (
          <g key={seg.id}>
            <path
              d={seg.pathData}
              fill={`url(#grad-${seg.id})`}
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1"
            />
            <text
              x={seg.lx}
              y={seg.ly}
              fill="white"
              fontSize={segments.length > 12 ? "14" : "22"}
              fontWeight="900"
              textAnchor="middle"
              alignmentBaseline="middle"
              transform={`rotate(${seg.textRotation}, ${seg.lx}, ${seg.ly})`}
              className="select-none pointer-events-none drop-shadow-lg uppercase tracking-tighter"
              style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.5))' }}
            >
              {seg.text.length > 15 ? `${seg.text.slice(0, 12)}...` : seg.text}
            </text>
          </g>
        ))}

        {/* Outer Ring Decorations */}
        <circle cx={cx} cy={cy} r={radius - 5} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
        
        {/* Lights/Dots around the rim */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const dotR = radius - 15;
          return (
            <circle 
              key={i} 
              cx={cx + dotR * Math.cos(angle)} 
              cy={cy + dotR * Math.sin(angle)} 
              r="4" 
              fill={isSpinning && i % 2 === Math.floor(Date.now() / 100) % 2 ? "#fff" : "rgba(255,255,255,0.4)"} 
              className="transition-colors duration-200"
            />
          );
        })}

        {/* Center Hub */}
        <g filter="url(#shadow)">
           <circle cx={cx} cy={cy} r="45" fill="#0f172a" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
           <circle cx={cx} cy={cy} r="35" fill="#1e293b" />
           <circle cx={cx} cy={cy} r="15" fill="white" className="animate-pulse" />
        </g>
      </svg>
    </div>
  );
};

export default SpinWheel;
