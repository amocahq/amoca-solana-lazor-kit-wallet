import { Project, EducationalResource, User, ForumPost } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Solar Farm in Nevada Desert',
    description: 'A large-scale solar farm project harnessing the abundant sunshine of the Nevada desert to generate clean electricity for thousands of homes.',
    imageUrl: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg',
    category: 'solar',
    location: 'Nevada, USA',
    fundingGoal: 2500000,
    currentFunding: 1750000,
    impactMetrics: {
      co2Reduction: 12500,
      energyGenerated: 45000,
      jobsCreated: 120,
      livesImpacted: 50000
    },
    duration: 36,
    riskLevel: 'medium',
    returns: 7.5
  },
  {
    id: '2',
    title: 'Wind Energy Cooperative',
    description: 'Community-owned wind turbines providing renewable energy and economic benefits directly to local residents.',
    imageUrl: 'https://images.pexels.com/photos/2908971/pexels-photo-2908971.jpeg',
    category: 'wind',
    location: 'Northern Scotland',
    fundingGoal: 1750000,
    currentFunding: 950000,
    impactMetrics: {
      co2Reduction: 8700,
      energyGenerated: 28000,
      jobsCreated: 45,
      livesImpacted: 15000
    },
    duration: 24,
    riskLevel: 'low',
    returns: 5.2
  },
  {
    id: '3',
    title: 'Rainforest Conservation Initiative',
    description: 'Protecting vital rainforest ecosystems while supporting sustainable livelihoods for indigenous communities.',
    imageUrl: 'https://images.pexels.com/photos/5282269/pexels-photo-5282269.jpeg',
    category: 'conservation',
    location: 'Amazon Basin, Brazil',
    fundingGoal: 3500000,
    currentFunding: 1250000,
    impactMetrics: {
      co2Reduction: 250000,
      jobsCreated: 75,
      livesImpacted: 12000
    },
    duration: 60,
    riskLevel: 'medium',
    returns: 4.0
  },
  {
    id: '4',
    title: 'Micro-Hydro Village Power',
    description: 'Small-scale hydroelectric generators bringing reliable electricity to remote villages without damaging local ecosystems.',
    imageUrl: 'https://images.pexels.com/photos/1259924/pexels-photo-1259924.jpeg',
    category: 'hydro',
    location: 'Nepal',
    fundingGoal: 850000,
    currentFunding: 710000,
    impactMetrics: {
      co2Reduction: 3200,
      energyGenerated: 5600,
      jobsCreated: 35,
      livesImpacted: 8500
    },
    duration: 18,
    riskLevel: 'medium',
    returns: 6.1
  },
  {
    id: '5',
    title: 'Regenerative Agriculture Network',
    description: 'Supporting farmers transitioning to regenerative practices that sequester carbon and restore soil health.',
    imageUrl: 'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg',
    category: 'sustainable-agriculture',
    location: 'Midwest, USA',
    fundingGoal: 1200000,
    currentFunding: 580000,
    impactMetrics: {
      co2Reduction: 75000,
      jobsCreated: 85,
      livesImpacted: 25000
    },
    duration: 48,
    riskLevel: 'low',
    returns: 5.8
  },
  {
    id: '6',
    title: 'Urban Vertical Farm',
    description: 'Cutting-edge vertical farming technology to grow organic produce in urban centers with minimal environmental footprint.',
    imageUrl: 'https://images.pexels.com/photos/6169716/pexels-photo-6169716.jpeg',
    category: 'sustainable-agriculture',
    location: 'Singapore',
    fundingGoal: 4500000,
    currentFunding: 3200000,
    impactMetrics: {
      co2Reduction: 4500,
      jobsCreated: 65,
      livesImpacted: 120000
    },
    duration: 30,
    riskLevel: 'high',
    returns: 9.2
  }
];

export const mockEducationalResources: EducationalResource[] = [
  {
    id: '1',
    title: 'Green Finance Fundamentals',
    description: 'An introduction to the basic concepts of sustainable investing and how your money can drive positive environmental change.',
    type: 'course',
    imageUrl: 'https://images.pexels.com/photos/7005693/pexels-photo-7005693.jpeg',
    readTime: 60,
    category: 'basics',
    url: '/education/green-finance-fundamentals'
  },
  {
    id: '2',
    title: 'Understanding Carbon Markets',
    description: 'Dive into how carbon credits work and why they&apos;re important in the fight against climate change.',
    type: 'article',
    imageUrl: 'https://images.pexels.com/photos/4385291/pexels-photo-4385291.jpeg',
    readTime: 15,
    category: 'advanced',
    url: '/education/carbon-markets'
  },
  {
    id: '3',
    title: 'Measuring Impact in Green Investments',
    description: 'Learn about the metrics and methodologies used to quantify the environmental and social impact of sustainable projects.',
    type: 'video',
    imageUrl: 'https://images.pexels.com/photos/8386367/pexels-photo-8386367.jpeg',
    readTime: 22,
    category: 'impact',
    url: '/education/measuring-impact'
  },
  {
    id: '4',
    title: 'Green Bonds Explained',
    description: 'A comprehensive guide to green bonds and how they differ from conventional fixed-income investments.',
    type: 'infographic',
    imageUrl: 'https://images.pexels.com/photos/7788009/pexels-photo-7788009.jpeg',
    readTime: 5,
    category: 'basics',
    url: '/education/green-bonds'
  }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
    investedProjects: ['1', '3'],
    savedProjects: ['2', '4', '5'],
    impactScore: 237,
    joinDate: new Date('2023-02-15')
  },
  {
    id: '2',
    name: 'Miguel Hernandez',
    email: 'miguel.h@example.com',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    investedProjects: ['2', '5', '6'],
    savedProjects: ['1'],
    impactScore: 412,
    joinDate: new Date('2022-11-03')
  }
];

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    authorId: '1',
    authorName: 'Sarah Johnson',
    authorAvatar: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg',
    title: 'How has investing in renewable energy projects changed your perspective?',
    content: 'After investing in my first solar project last year, I've become much more aware of my daily energy consumption. Has anyone else experienced this shift in awareness?',
    likes: 24,
    comments: 8,
    tags: ['personal-experience', 'renewable-energy', 'mindset-shift'],
    createdAt: new Date('2023-10-12')
  },
  {
    id: '2',
    authorId: '2',
    authorName: 'Miguel Hernandez',
    authorAvatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    title: 'Comparing returns: Traditional investments vs. Green investments',
    content: 'I've been tracking the performance of my green portfolio against my traditional investments, and the results have been surprising. Would anyone be interested in seeing the data?',
    likes: 56,
    comments: 17,
    tags: ['investment-returns', 'portfolio-comparison', 'data-analysis'],
    createdAt: new Date('2023-09-28')
  }
];

export const impactData = {
  totalProjects: 157,
  totalInvestment: 42500000,
  co2Reduction: 1250000,
  energyGenerated: 3750000,
  jobsCreated: 12500,
  livesImpacted: 850000
};