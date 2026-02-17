
export type TestMode = 'time' | 'words';

export interface TestStats {
  wpm: number;
  accuracy: number;
  consistency: number;
  rawWpm: number;
  timeTaken: number;
  errors: number;
}

export interface HistoryItem extends TestStats {
  id: string;
  date: string;
  mode: TestMode;
  category: string;
}

export interface AppSettings {
  difficulty: 'normal' | 'expert';
  sound: boolean;
  theme: 'dark' | 'light' | 'gray';
  includeNumbers: boolean;
  includePunctuation: boolean;
  defaultTestMode: TestMode;
}

export interface UserProfile {
  isAuthorized: boolean;
  accessKey: string;
  username: string;
}

export type TextCategory = 'avionics' | 'thermal' | 'life-support' | 'propulsion' | 'quantum' | 'cryogenics' | 'orbital' | 'robotics' | 'navigation';
