export interface Folder {
  id: string;
  title: string;
  isDefault?: boolean;
  count: number;
}

export interface Bookmark {
  id: string;
  folder: string;
  title: string;
  url: string;
  starred?: boolean;
  tags?: string[];
  dateAdded?: number;
  originalFolder?: string;
}

export interface Task {
  id: string;
  folder: string;
  title: string;
  reminderDateTime?: string;
  completed?: boolean;
  dateAdded?: number;
  completedDate?: number | null;
  previousFolder?: string | null;
  originalFolder?: string;
  reminderSent?: boolean;
  lastModified?: number;
}

export type NoteType = 'note' | 'snippet' | 'markdown';

export interface Note {
  id: string;
  heading: string;
  content: string;
  tags: string[];
  timestamp: string;
  starred?: boolean;
  type: NoteType;
}

export interface SocialProfiles {
  linkedin: string;
  github: string;
  twitter: string;
  instagram: string;
  reddit: string;
}

export interface BookmarkLink {
  url: string;
  name: string;
}

export interface UINotification {
  title: string;
  body: string;
}

export type BackgroundType = 'theme' | 'image';

export interface BackgroundConfig {
  type: BackgroundType;
  imageUrl?: string; // path like '/backgrounds/city-night.jpg' or base64 data URL
  overlayOpacity?: number; // 0-0.9, default 0.3
  blur?: number; // 0-20px, default 0
}

export interface Settings {
  userName: string;
  userRole: string;
  userPortfolioUrl: string;
  theme: string;
  searchEngine: string;
  weatherLocation: string;
  hideSeconds: boolean;
  use12Hour: boolean;
  socialProfiles: SocialProfiles;
  bookmarks: BookmarkLink[];
  background?: BackgroundConfig;
  focusMode?: boolean;
}
