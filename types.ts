
export interface WheelSegment {
  id: string;
  text: string;
  color: string;
}

export interface GameSettings {
  soundEnabled: boolean;
  segments: WheelSegment[];
}
