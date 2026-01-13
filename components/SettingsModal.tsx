
import React, { useState } from 'react';
import { WheelSegment, GameSettings } from '../types';
import { COLOR_PALETTE } from '../constants';

interface SettingsModalProps {
  settings: GameSettings;
  onClose: () => void;
  onUpdateSegments: (segments: WheelSegment[]) => void;
  onToggleSound: () => void;
  onReset: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  settings, 
  onClose, 
  onUpdateSegments, 
  onToggleSound,
  onReset
}) => {
  const [newText, setNewText] = useState('');

  const handleAdd = () => {
    if (!newText.trim()) return;
    const newSegment: WheelSegment = {
      id: Math.random().toString(36).substr(2, 9),
      text: newText.trim(),
      color: COLOR_PALETTE[settings.segments.length % COLOR_PALETTE.length]
    };
    onUpdateSegments([...settings.segments, newSegment]);
    setNewText('');
  };

  const handleDelete = (id: string) => {
    if (settings.segments.length <= 2) {
      alert("You need at least 2 segments to spin!");
      return;
    }
    onUpdateSegments(settings.segments.filter(s => s.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newSegments = [...settings.segments];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newSegments.length) return;
    
    [newSegments[index], newSegments[targetIndex]] = [newSegments[targetIndex], newSegments[index]];
    onUpdateSegments(newSegments);
  };

  const handleEdit = (id: string, text: string) => {
    onUpdateSegments(settings.segments.map(s => s.id === id ? { ...s, text } : s));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#1a1a2e] border border-white/10 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Wheel Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Global Toggles */}
          <div className="flex items-center justify-between glass-card p-4 rounded-xl">
            <span className="font-semibold">Sound Effects</span>
            <button 
              onClick={onToggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative ${settings.soundEnabled ? 'bg-cyan-500' : 'bg-gray-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.soundEnabled ? 'left-7' : 'left-1'}`}></div>
            </button>
          </div>

          {/* Add Item */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Add New Item</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder="Enter prize name..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
              />
              <button 
                onClick={handleAdd}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg font-bold"
              >
                Add
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <label className="text-sm text-gray-400 font-medium">Manage Items ({settings.segments.length})</label>
            <div className="space-y-2">
              {settings.segments.map((seg, idx) => (
                <div key={seg.id} className="flex items-center gap-2 glass-card p-2 rounded-lg">
                  <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }}></div>
                  <input 
                    type="text"
                    value={seg.text}
                    onChange={(e) => handleEdit(seg.id, e.target.value)}
                    className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                  />
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => moveItem(idx, 'up')} 
                      disabled={idx === 0}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-20"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => moveItem(idx, 'down')} 
                      disabled={idx === settings.segments.length - 1}
                      className="p-1 hover:bg-white/10 rounded disabled:opacity-20"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => handleDelete(seg.id)}
                      className="p-1 hover:bg-red-500/20 text-red-400 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 flex justify-between gap-4">
          <button 
            onClick={onReset}
            className="text-gray-400 hover:text-white text-sm"
          >
            Reset to Default
          </button>
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg font-bold"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
