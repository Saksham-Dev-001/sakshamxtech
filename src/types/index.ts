export type ContentCategory = 
  | 'arcade' 
  | 'unstop' 
  | 'blogs' 
  | 'opportunities' 
  | 'swags' 
  | 'c-academy' 
  | 'tools' 
  | 'resources';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  category: 'Google Cloud' | 'Artificial Intelligence' | 'Programming' | 'Web Development' | 'Career' | 'Tutorials';
  tags: string[];
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTimeMinutes: number;
  featured: boolean;
  views: number;
  youtubeVideoId?: string;
  officialLink?: string;
  officialLinkLabel?: string;
  deadline?: string;
  perks?: string;
  eligibility?: string;
  quickSteps?: string[];
  status?: 'published' | 'scheduled' | 'draft';
  scheduledAt?: string; // ISO 8601 string or YYYY-MM-DDTHH:mm in Delhi Time (Asia/Kolkata)
  updatedAt?: number;
}

export interface ArcadeSolution {
  id: string;
  slug: string;
  title: string;
  labCode: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMinutes: number;
  category: 'Skill Badge' | 'Arcade Lab' | 'Trivia' | 'Certification Prep';
  badgeTitle?: string;
  badgeImageUrl?: string;
  description: string;
  prerequisites: string[];
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    command?: string;
    note?: string;
  }[];
  importantCommands: string[];
  youtubeVideoId?: string;
  pointsAwarded: number;
  lastUpdated: string;
  isPublished: boolean;
  updatedAt?: number;
}

export interface UnstopProblem {
  id: string;
  dayNumber: number;
  date: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  solutionExplanation: string;
  codeSolutions: {
    language: 'c' | 'cpp' | 'java' | 'python' | 'javascript';
    code: string;
  }[];
  youtubeVideoId?: string;
  tags: string[];
  updatedAt?: number;
}

export interface Opportunity {
  id: string;
  title: string;
  slug: string;
  company: string;
  logo: string;
  category: 'Internships' | 'Hackathons' | 'Student Programs' | 'Competitions' | 'Scholarships' | 'Certifications' | 'Webinars';
  type: 'Remote' | 'On-site' | 'Hybrid';
  location?: string;
  description: string;
  eligibility: string;
  benefits: string[];
  deadline: string;
  officialUrl: string;
  status: 'Active' | 'Closing Soon' | 'Upcoming' | 'Expired';
  featured: boolean;
  postedDate: string;
  clicksCount: number;
  updatedAt?: number;
}

export interface SwagItem {
  id: string;
  title: string;
  brand: 'Google Cloud Arcade' | 'Microsoft' | 'GitHub' | 'Dev Community' | 'Hackathon';
  category: 'Backpack' | 'Hoodie' | 'T-Shirt' | 'Water Bottle' | 'Stickers & Badges' | 'Champion Kit' | 'Combo Swag' | 'Magic Mug' | 'Tech Accessories' | 'Jacket' | 'Lighting' | string;
  imageUrl: string;
  description: string;
  tierRequired?: string;
  pointsRequired?: number;
  eligibility: string;
  howToClaim: string[];
  campaignStartDate: string;
  campaignEndDate: string;
  officialSourceUrl: string;
  status: 'Active' | 'Upcoming' | 'Expired';
  featured: boolean;
  revealedDate?: string;
  tierTags?: ('Trooper' | 'Ranger' | 'Champion' | 'Legend' | 'All Tiers')[];
  updatedAt?: number;
}

export interface CLesson {
  id: string;
  dayNumber: number;
  title: string;
  slug: string;
  summary: string;
  durationMinutes: number;
  content: string;
  codeSnippet: string;
  expectedOutput: string;
  youtubeVideoId: string;
  practiceQuestions: {
    question: string;
    hint?: string;
    solutionCode: string;
  }[];
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
  isPublished: boolean;
  status?: 'published' | 'scheduled' | 'draft';
  scheduledAt?: string;
  updatedAt?: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  category: 'Cheat Sheet' | 'Roadmap' | 'PDF Notes' | 'Lab Guide' | 'Code Template';
  format: 'PDF' | 'ZIP' | 'Markdown' | 'Link';
  fileSize: string;
  downloadUrl: string;
  previewImageUrl: string;
  tags: string[];
  downloadsCount: number;
  publishedDate: string;
  updatedAt?: number;
}

export interface YouTubeVideoItem {
  id: string;
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  publishedAtRaw?: string;
  duration: string;
  views?: string;
  viewCount?: number;
  category: 'Google Cloud' | 'Unstop' | 'C Programming' | 'Tech Swags' | 'Career';
  playlistId?: string;
}

export interface SiteStatistics {
  youtubeSubscribers: string;
  youtubeVideos: string;
  technicalSolutions: string;
  publishedBlogs: string;
  opportunitiesListed: string;
  studentCommunity: string;
}

export interface ArcadeCalculatorConfig {
  pointsPerSkillBadge: number;
  pointsPerTriviaGame: number;
  pointsPerLabCompletion: number;
  tiers: {
    tierName: string;
    minPoints: number;
    swags: string[];
    color: string;
  }[];
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  creatorName: string;
  creatorTitle: string;
  creatorBio: string;
  creatorAvatarUrl: string;
  adminEmail: string;
  socialLinks: {
    youtube: string;
    telegram: string;
    whatsapp: string;
    discord: string;
    linkedin: string;
    instagram: string;
    github: string;
    twitter: string;
  };
  statistics: SiteStatistics;
  announcement: {
    enabled: boolean;
    text: string;
    linkUrl?: string;
    badgeText: string;
  };
  adsConfig: {
    enabled: boolean;
    headerBanner: boolean;
    sidebarBanner: boolean;
    inArticleBanner: boolean;
    adClient: string;
  };
  oneSignalAppId?: string;
}

export interface AnalyticsMetric {
  totalVisitors: number;
  todayVisitors: number;
  pageViews: number;
  resourceDownloads: number;
  compilerExecutions: number;
  calculatorUses: number;
  youtubeClicks: number;
  opportunityClicks: number;
  topPages: { path: string; count: number }[];
  searchQueries: { query: string; count: number }[];
  deviceBreakdown: { device: string; percentage: number }[];
}

export interface LeaderboardUser {
  rank: number;
  displayName: string;
  points: number;
  badgesCount: number;
  avatar: string;
  tier: string;
  streakDays: number;
}
