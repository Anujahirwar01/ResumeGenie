import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../db/db.js';
import { KeywordDatabase } from '../models/index.js';

const sampleKeywordData = [
  // Technology - Entry Level
  {
    industry: 'technology',
    jobLevel: 'entry',
    keywords: [
      { keyword: 'HTML', category: 'technical', relevanceScore: 3 },
      { keyword: 'CSS', category: 'technical', relevanceScore: 3 },
      { keyword: 'JavaScript', category: 'technical', relevanceScore: 5 },
      { keyword: 'React', category: 'technical', relevanceScore: 4 },
      { keyword: 'Git', category: 'technical', relevanceScore: 4 },
      { keyword: 'API', category: 'technical', relevanceScore: 3 },
      { keyword: 'Database', category: 'technical', relevanceScore: 3 },
      { keyword: 'Problem Solving', category: 'soft', relevanceScore: 4 },
      { keyword: 'Team Collaboration', category: 'soft', relevanceScore: 4 },
      { keyword: 'Communication', category: 'soft', relevanceScore: 3 },
      { keyword: 'Agile', category: 'methodology', relevanceScore: 3 },
      { keyword: 'Version Control', category: 'technical', relevanceScore: 3 },
      { keyword: 'Debugging', category: 'technical', relevanceScore: 4 },
      { keyword: 'Testing', category: 'technical', relevanceScore: 3 }
    ]
  },

  // Technology - Mid Level
  {
    industry: 'technology',
    jobLevel: 'mid',
    keywords: [
      { keyword: 'Node.js', category: 'technical', relevanceScore: 5 },
      { keyword: 'Python', category: 'technical', relevanceScore: 4 },
      { keyword: 'SQL', category: 'technical', relevanceScore: 4 },
      { keyword: 'MongoDB', category: 'technical', relevanceScore: 4 },
      { keyword: 'Express.js', category: 'technical', relevanceScore: 4 },
      { keyword: 'REST API', category: 'technical', relevanceScore: 5 },
      { keyword: 'Docker', category: 'technical', relevanceScore: 4 },
      { keyword: 'AWS', category: 'technical', relevanceScore: 5 },
      { keyword: 'Microservices', category: 'technical', relevanceScore: 4 },
      { keyword: 'CI/CD', category: 'technical', relevanceScore: 4 },
      { keyword: 'Code Review', category: 'soft', relevanceScore: 4 },
      { keyword: 'Mentoring', category: 'soft', relevanceScore: 3 },
      { keyword: 'Project Management', category: 'soft', relevanceScore: 4 },
      { keyword: 'System Design', category: 'technical', relevanceScore: 5 }
    ]
  },

  // Technology - Senior Level
  {
    industry: 'technology',
    jobLevel: 'senior',
    keywords: [
      { keyword: 'Architecture', category: 'technical', relevanceScore: 5 },
      { keyword: 'Kubernetes', category: 'technical', relevanceScore: 5 },
      { keyword: 'Leadership', category: 'soft', relevanceScore: 5 },
      { keyword: 'System Architecture', category: 'technical', relevanceScore: 5 },
      { keyword: 'Performance Optimization', category: 'technical', relevanceScore: 4 },
      { keyword: 'Scalability', category: 'technical', relevanceScore: 5 },
      { keyword: 'Technical Strategy', category: 'soft', relevanceScore: 5 },
      { keyword: 'Team Leadership', category: 'soft', relevanceScore: 5 },
      { keyword: 'DevOps', category: 'technical', relevanceScore: 4 },
      { keyword: 'Security', category: 'technical', relevanceScore: 4 },
      { keyword: 'Cloud Computing', category: 'technical', relevanceScore: 5 },
      { keyword: 'Stakeholder Management', category: 'soft', relevanceScore: 4 },
      { keyword: 'Technical Decision Making', category: 'soft', relevanceScore: 5 },
      { keyword: 'Cross-functional Collaboration', category: 'soft', relevanceScore: 4 }
    ]
  },

  // Finance - General
  {
    industry: 'finance',
    jobLevel: 'general',
    keywords: [
      { keyword: 'Financial Analysis', category: 'technical', relevanceScore: 5 },
      { keyword: 'Excel', category: 'technical', relevanceScore: 4 },
      { keyword: 'Financial Modeling', category: 'technical', relevanceScore: 5 },
      { keyword: 'Budget Planning', category: 'technical', relevanceScore: 4 },
      { keyword: 'Forecasting', category: 'technical', relevanceScore: 4 },
      { keyword: 'Risk Management', category: 'technical', relevanceScore: 4 },
      { keyword: 'Compliance', category: 'technical', relevanceScore: 4 },
      { keyword: 'Financial Reporting', category: 'technical', relevanceScore: 4 },
      { keyword: 'Investment Analysis', category: 'technical', relevanceScore: 4 },
      { keyword: 'Portfolio Management', category: 'technical', relevanceScore: 4 },
      { keyword: 'Attention to Detail', category: 'soft', relevanceScore: 4 },
      { keyword: 'Analytical Thinking', category: 'soft', relevanceScore: 5 },
      { keyword: 'Communication', category: 'soft', relevanceScore: 4 },
      { keyword: 'Problem Solving', category: 'soft', relevanceScore: 4 }
    ]
  },

  // Marketing - General
  {
    industry: 'marketing',
    jobLevel: 'general',
    keywords: [
      { keyword: 'Digital Marketing', category: 'technical', relevanceScore: 5 },
      { keyword: 'SEO', category: 'technical', relevanceScore: 4 },
      { keyword: 'Social Media Marketing', category: 'technical', relevanceScore: 4 },
      { keyword: 'Content Marketing', category: 'technical', relevanceScore: 4 },
      { keyword: 'Google Analytics', category: 'technical', relevanceScore: 4 },
      { keyword: 'PPC Advertising', category: 'technical', relevanceScore: 4 },
      { keyword: 'Email Marketing', category: 'technical', relevanceScore: 3 },
      { keyword: 'Brand Management', category: 'technical', relevanceScore: 4 },
      { keyword: 'Campaign Management', category: 'technical', relevanceScore: 4 },
      { keyword: 'Market Research', category: 'technical', relevanceScore: 4 },
      { keyword: 'Creativity', category: 'soft', relevanceScore: 4 },
      { keyword: 'Communication', category: 'soft', relevanceScore: 5 },
      { keyword: 'Project Management', category: 'soft', relevanceScore: 4 },
      { keyword: 'Data Analysis', category: 'technical', relevanceScore: 4 }
    ]
  },

  // Healthcare - General
  {
    industry: 'healthcare',
    jobLevel: 'general',
    keywords: [
      { keyword: 'Patient Care', category: 'technical', relevanceScore: 5 },
      { keyword: 'Medical Records', category: 'technical', relevanceScore: 4 },
      { keyword: 'Healthcare Compliance', category: 'technical', relevanceScore: 4 },
      { keyword: 'HIPAA', category: 'technical', relevanceScore: 4 },
      { keyword: 'Clinical Experience', category: 'technical', relevanceScore: 5 },
      { keyword: 'Electronic Health Records', category: 'technical', relevanceScore: 4 },
      { keyword: 'Healthcare Regulations', category: 'technical', relevanceScore: 4 },
      { keyword: 'Quality Assurance', category: 'technical', relevanceScore: 4 },
      { keyword: 'Healthcare Administration', category: 'technical', relevanceScore: 3 },
      { keyword: 'Medical Terminology', category: 'technical', relevanceScore: 4 },
      { keyword: 'Empathy', category: 'soft', relevanceScore: 5 },
      { keyword: 'Attention to Detail', category: 'soft', relevanceScore: 5 },
      { keyword: 'Communication', category: 'soft', relevanceScore: 5 },
      { keyword: 'Team Collaboration', category: 'soft', relevanceScore: 4 }
    ]
  },

  // General - Universal Keywords
  {
    industry: 'general',
    jobLevel: 'general',
    keywords: [
      { keyword: 'Communication', category: 'soft', relevanceScore: 5 },
      { keyword: 'Leadership', category: 'soft', relevanceScore: 4 },
      { keyword: 'Problem Solving', category: 'soft', relevanceScore: 5 },
      { keyword: 'Team Collaboration', category: 'soft', relevanceScore: 4 },
      { keyword: 'Project Management', category: 'soft', relevanceScore: 4 },
      { keyword: 'Time Management', category: 'soft', relevanceScore: 4 },
      { keyword: 'Adaptability', category: 'soft', relevanceScore: 4 },
      { keyword: 'Critical Thinking', category: 'soft', relevanceScore: 4 },
      { keyword: 'Initiative', category: 'soft', relevanceScore: 3 },
      { keyword: 'Customer Service', category: 'soft', relevanceScore: 3 },
      { keyword: 'Attention to Detail', category: 'soft', relevanceScore: 4 },
      { keyword: 'Organizational Skills', category: 'soft', relevanceScore: 3 },
      { keyword: 'Analytical Skills', category: 'soft', relevanceScore: 4 },
      { keyword: 'Multitasking', category: 'soft', relevanceScore: 3 }
    ]
  }
];

async function seedKeywordDatabase() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    console.log('Clearing existing keyword data...');
    await KeywordDatabase.deleteMany({});

    console.log('Inserting sample keyword data...');
    await KeywordDatabase.insertMany(sampleKeywordData);

    console.log('✅ Keyword database seeded successfully!');
    console.log(`📊 Inserted ${sampleKeywordData.length} keyword sets`);
    
    // Print summary
    for (const data of sampleKeywordData) {
      console.log(`   - ${data.industry} (${data.jobLevel}): ${data.keywords.length} keywords`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding keyword database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedKeywordDatabase();
