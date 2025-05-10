export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: 'solar' | 'wind' | 'hydro' | 'conservation' | 'sustainable-agriculture' | 'other';
  location: string;
  fundingGoal: number;
  currentFunding: number;
  impactMetrics: {
    co2Reduction: number; // in tons
    energyGenerated?: number; // in MWh
    jobsCreated?: number;
    livesImpacted?: number;
  };
  duration: number; // in months
  riskLevel: 'low' | 'medium' | 'high';
  returns: number; // expected returns in percentage
}

export interface EducationalResource {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'infographic';
  imageUrl: string;
  readTime?: number; // in minutes
  category: 'basics' | 'advanced' | 'policy' | 'impact' | 'technology';
  url: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  investedProjects: string[]; // project IDs
  savedProjects: string[]; // project IDs
  impactScore: number;
  joinDate: Date;
}

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  createdAt: Date;
}