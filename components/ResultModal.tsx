
import React, { useEffect, useState } from 'react';
import { WheelSegment } from '../types';

interface ResultModalProps {
  winner: WheelSegment;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ winner, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-700 ${isVisible ? 'bg-black/90 backdrop-blur-xl opacity-100' : 'bg-black/0 opacity-0'}`}>
      {/* Celebration Background Particles (CSS based) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-2 h-2 rounded-full animate-ping"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              backgroundColor: winner.color,
              animationDelay: `${Math.random() * 2}s`,
              opacity: 0.3
            }}
          ></div>
        ))}
      </div>

      <div className={`w-full max-w-sm transform transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-50 translate-y-24 opacity-0'}`}>
        <div className="relative bg-[#1e293b] border-2 border-white/10 rounded-[40px] p-10 text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Accent Glows */}
          <div className="absolute -top-20 -left-20 w-64 h-64 blur-[80px] rounded-full opacity-30" style={{ backgroundColor: winner.color }}></div>
          <div className="absolute -bottom-20 -right-20 w-64 h-64 blur-[80px] rounded-full opacity-20" style={{ backgroundColor: '#fff' }}></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 p-6 rounded-full bg-white/5 border border-white/10 text-yellow-400 animate-[bounce_2s_infinite]">
              <TrophyIcon />
            </div>
            
            <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Congratulations!</h2>
            
            <p className="text-white/60 text-sm font-medium mb-2 uppercase tracking-widest">You won</p>
            <div 
              className="text-4xl md:text-5xl font-black mb-8 drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] tracking-tighter"
              style={{ color: winner.color }}
            >
              {winner.text}
            </div>

            <button 
              onClick={onClose}
              className="group relative w-full py-5 bg-white text-black font-black text-lg rounded-3xl hover:bg-gray-100 transition-all active:scale-95 shadow-[0_10px_30px_rgba(255,255,255,0.1)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              CLAIM REWARD
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55.47.98.97 1.21C11.47 18.44 12 19 12 19s.53-.56 1.03-.79c.5-.23.97-.66.97-1.21v-2.34"></path>
    <path d="M12 2v12.66"></path>
  </svg>
);

export default ResultModal;
