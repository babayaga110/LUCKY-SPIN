
import { WheelSegment } from './types';

export const DEFAULT_SEGMENTS: WheelSegment[] = [
  { id: '1', text: 'Jackpot', color: '#EF4444' },    // Red
  { id: '2', text: 'Mystery Box', color: '#F59E0B' }, // Amber
  { id: '3', text: 'Try Again', color: '#10B981' },  // Emerald
  { id: '4', text: 'Gift Card', color: '#3B82F6' },  // Blue
  { id: '5', text: 'Big Hug', color: '#8B5CF6' },    // Violet
  { id: '6', text: '10% Off', color: '#EC4899' },    // Pink
];

export const COLOR_PALETTE = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1', 
  '#8B5CF6', '#A855F7', '#D946EF', '#EC4899', '#F43F5E'
];

export const STORAGE_KEY = 'gemini_wheel_settings';
