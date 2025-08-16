import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

class FileProcessorEnhanced {
  constructor() {
    this.supportedFormats = ['.pdf', '.doc', '.docx', '.txt'];
    this.maxFileSize = 5 * 1024 * 1024; // 5MB
  }

  /**
   * Validate uploaded file
   */
  validateFile(file) {
    const errors = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push('File size must be less than 5MB');
    }

    // Check file format
    const fileExtension = path.extname(file.originalname).toLowerCase();
    if (!this.supportedFormats.includes(fileExtension)) {
      errors.push('Only PDF, DOC, DOCX, and TXT files are supported');
    }

    // Check if file exists and has content
    if (!file.buffer || file.buffer.length === 0) {
      errors.push('File appears to be empty');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Extract text from uploaded resume file
   */
  async extractText(file) {
    try {
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const fileExtension = path.extname(file.originalname).toLowerCase();
      let extractedText = '';

      switch (fileExtension) {
        case '.pdf':
          extractedText = await this.extractFromPDF(file.buffer);
          break;
        case '.doc':
        case '.docx':
          extractedText = await this.extractFromWord(file.buffer);
          break;
        case '.txt':
          extractedText = file.buffer.toString('utf-8');
          break;
        default:
          throw new Error('Unsupported file format');
      }

      // Clean and process the extracted text
      const cleanedText = this.cleanText(extractedText);
      
      // Extract structured information with enhanced parsing
      const structuredInfo = this.extractStructuredInfo(cleanedText);
      
      return {
        text: cleanedText,
        structured: structuredInfo,
        metadata: this.getFileMetadata(file, structuredInfo)
      };

    } catch (error) {
      console.error('Text extraction error:', error);
      throw new Error(`Failed to extract text: ${error.message}`);
    }
  }

  /**
   * Extract text from PDF (using sample data for demonstration)
   */
  async extractFromPDF(buffer) {
    try {
      // For demonstration, we return varied sample resume content
      // In production, you would use a PDF parsing library like pdf-parse
      
      const sampleResumes = [
        // Senior Software Engineer Resume
        `John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | San Francisco, CA | LinkedIn: linkedin.com/in/johnsmith

PROFESSIONAL SUMMARY
Results-driven senior software engineer with 8+ years of experience in full-stack web development. 
Proven track record of delivering scalable applications and leading development teams. Expertise in modern 
JavaScript frameworks, cloud technologies, and agile methodologies.

TECHNICAL SKILLS
Languages: JavaScript, TypeScript, Python, Java, Go, HTML5, CSS3
Frontend: React, Vue.js, Angular, Redux, SCSS, Webpack, Jest
Backend: Node.js, Express, Django, Spring Boot, FastAPI, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis, Elasticsearch
Cloud & DevOps: AWS, Google Cloud, Docker, Kubernetes, Jenkins, Git
Tools: JIRA, Confluence, Figma, Postman, VS Code

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | San Francisco, CA | 2020-Present
• Architected and developed microservices serving 500,000+ daily active users with 99.9% uptime
• Improved application performance by 60% through code optimization and Redis caching implementation
• Led cross-functional team of 5 developers on enterprise projects worth $2M+ in revenue
• Mentored 3 junior developers and conducted weekly code reviews improving team code quality by 40%
• Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes
• Designed RESTful APIs used by 50+ internal applications across the organization

Software Engineer | StartupXYZ | Palo Alto, CA | 2018-2020
• Built RESTful APIs using Node.js, Express, and MongoDB handling 100K+ requests per day
• Developed React components for customer-facing dashboard used by 10,000+ daily users
• Collaborated with product team on feature specifications resulting in 25% increase in user engagement
• Implemented automated testing suite achieving 95% code coverage
• Optimized database queries reducing average response time by 45%

Junior Developer | WebSolutions | San Jose, CA | 2016-2018
• Created responsive websites for 20+ clients using HTML, CSS, and JavaScript
• Participated in agile development process and sprint planning sessions
• Fixed 200+ bugs and implemented 50+ minor feature enhancements
• Collaborated with UX designers to improve user experience across 5 major projects

EDUCATION
Bachelor of Science in Computer Science | Stanford University | Stanford, CA | 2016
GPA: 3.8/4.0, Dean's List (4 semesters), Computer Science Honor Society

CERTIFICATIONS
• AWS Certified Solutions Architect - Associate (2022)
• Google Cloud Professional Developer (2021)
• Certified Scrum Master (CSM) (2020)

NOTABLE PROJECTS
E-commerce Platform (2021)
• Built scalable e-commerce platform using React, Node.js, and MongoDB
• Integrated Stripe payment processing and inventory management system
• Achieved 99.9% uptime and handled 10,000+ concurrent users during peak sales
• Generated $500K+ in first year sales

Real-time Chat Application (2020)
• Developed real-time messaging app using WebSocket and Redis
• Implemented end-to-end encryption for secure communications
• Supported 1,000+ concurrent users with sub-second message delivery

ACHIEVEMENTS
• Employee of the Year 2021 - TechCorp Inc.
• Published article "Microservices Best Practices" in Tech Weekly (2022)
• Speaker at JavaScript Conference 2021 - "Scaling Node.js Applications"
• Led team that won company hackathon with AI-powered code review tool`,

        // Marketing Manager Resume
        `Sarah Johnson
Digital Marketing Manager
sarah.johnson@email.com | (555) 987-6543 | New York, NY | LinkedIn: linkedin.com/in/sarahjohnson

PROFESSIONAL SUMMARY
Dynamic marketing professional with 6+ years of experience in digital marketing, brand management, 
and campaign optimization. Proven expertise in data-driven marketing strategies, team leadership, 
and driving revenue growth through innovative campaigns.

CORE COMPETENCIES
Digital Marketing: Google Ads, Facebook Ads, LinkedIn Ads, SEO/SEM, Email Marketing
Analytics: Google Analytics, HubSpot, Salesforce, Tableau, Adobe Analytics
Content Creation: Adobe Creative Suite, Canva, Figma, WordPress, Hootsuite
Project Management: Asana, Trello, Monday.com, Slack, Zoom
Social Media: Facebook, Instagram, Twitter, LinkedIn, TikTok, YouTube

PROFESSIONAL EXPERIENCE

Digital Marketing Manager | BrandCorp | New York, NY | 2021-Present
• Developed and executed integrated marketing campaigns increasing brand awareness by 40%
• Managed $500K annual marketing budget across 8 different channels and platforms
• Led team of 4 marketing specialists and coordinated with 3 external agencies
• Implemented HubSpot marketing automation reducing manual work by 50% and improving lead quality
• Achieved 35% increase in qualified leads through optimized landing pages and A/B testing
• Improved email marketing open rates from 18% to 28% through segmentation and personalization

Digital Marketing Specialist | Creative Agency | Chicago, IL | 2019-2021
• Created and optimized Google Ads campaigns with 25% improvement in ROI ($2.5M ad spend)
• Managed social media presence across 5 platforms with 200K+ total followers
• Analyzed campaign performance and provided data-driven recommendations to C-level executives
• Collaborated with design team on creative assets achieving 45% higher engagement rates
• Launched influencer marketing program generating 500K+ impressions and 15% sales increase

Marketing Coordinator | Local Business Solutions | Chicago, IL | 2018-2019
• Coordinated 12 marketing events and trade shows resulting in 300+ new leads
• Managed email marketing campaigns with 15% open rate improvement (industry average: 21%)
• Created content for blog and social media channels increasing website traffic by 60%
• Tracked marketing KPIs and created monthly performance reports for executive team
• Assisted in rebranding initiative that increased brand recognition by 30%

EDUCATION
Master of Business Administration (MBA) | Northwestern Kellogg | Evanston, IL | 2018
Concentration: Marketing and Analytics, GPA: 3.7/4.0

Bachelor of Arts in Marketing | University of Illinois | Urbana-Champaign, IL | 2016
Magna Cum Laude, Marketing Club President, Dean's List (6 semesters)

CERTIFICATIONS
• Google Ads Certified (Search, Display, Video, Shopping)
• Google Analytics Individual Qualification (IQ)
• HubSpot Content Marketing Certified
• Facebook Blueprint Certified
• Hootsuite Social Media Marketing Certified

ACHIEVEMENTS & RECOGNITION
• Increased lead generation by 35% through optimized conversion funnels
• Won "Best Integrated Campaign" award at Regional Marketing Conference 2022
• Published article "Marketing Automation Trends" in Marketing Today magazine (2022)
• Grew company social media following from 50K to 200K+ in 18 months
• Achieved 150% of annual lead generation target for 2 consecutive years

NOTABLE CAMPAIGNS
"Summer Sales Spectacular" Campaign (2022)
• Multi-channel campaign across Google, Facebook, email, and influencer partnerships
• Generated $1.2M in revenue with 4:1 ROI over 3-month period
• Reached 2.5M+ people with 85% brand recall rate

"Back to School" Social Media Campaign (2021)
• TikTok and Instagram campaign targeting Gen Z audience
• Achieved 5M+ views and 25% engagement rate
• Resulted in 40% increase in website traffic from social media`,

        // Data Scientist Resume
        `Dr. Emily Chen
Senior Data Scientist
emily.chen@email.com | (555) 456-7890 | Seattle, WA | LinkedIn: linkedin.com/in/emilychen

PROFESSIONAL SUMMARY
Experienced data scientist with PhD in Statistics and 5+ years applying machine learning 
to solve complex business problems. Proven ability to translate data insights into actionable 
strategies that drive revenue growth and operational efficiency. Expert in Python, R, and cloud platforms.

TECHNICAL SKILLS
Programming: Python, R, SQL, Scala, Julia, Java, Bash
Machine Learning: TensorFlow, PyTorch, Scikit-learn, Keras, XGBoost, LightGBM
Big Data: Apache Spark, Hadoop, Kafka, Airflow, Databricks
Cloud Platforms: AWS (SageMaker, S3, EC2, Lambda), Google Cloud (BigQuery, Vertex AI), Azure
Databases: PostgreSQL, MongoDB, Cassandra, Snowflake, Redis
Visualization: Tableau, Power BI, Matplotlib, Plotly, Seaborn, D3.js
MLOps: Docker, Kubernetes, MLflow, Kubeflow, Git, CI/CD

PROFESSIONAL EXPERIENCE

Senior Data Scientist | AI Innovations Inc. | Seattle, WA | 2022-Present
• Developed predictive models improving customer retention by 30% ($2.5M annual impact)
• Built recommendation system serving 1M+ users with 95% accuracy and 40% CTR improvement
• Led data science team of 3 on multiple high-impact projects with $5M+ business value
• Presented findings to C-level executives and board members influencing strategic decisions
• Implemented A/B testing framework reducing experimentation time by 60%
• Deployed ML models to production serving 100K+ predictions per day with 99.9% uptime

Data Scientist | Analytics Firm | Portland, OR | 2020-2022
• Created machine learning models for fraud detection reducing false positives by 40%
• Performed statistical analysis and A/B testing for product optimization across 20+ features
• Built automated data pipelines processing 10TB+ daily data with 99.5% reliability
• Collaborated with engineering team on model deployment achieving 50ms average latency
• Developed customer segmentation models increasing marketing campaign effectiveness by 35%
• Saved company $1.5M annually through improved operational efficiency models

Research Data Scientist | University Research Lab | Stanford, CA | 2018-2020
• Conducted research on natural language processing and sentiment analysis
• Published 5 peer-reviewed papers in top-tier journals (Nature AI, ICML, NeurIPS)
• Mentored 8 undergraduate students on research projects and thesis work
• Secured $500K in research grants from NSF, NIH, and industry partnerships
• Developed open-source NLP library with 10K+ GitHub stars and 500+ citations

EDUCATION
PhD in Statistics | Stanford University | Stanford, CA | 2020
Dissertation: "Deep Learning Approaches for Time Series Forecasting in Healthcare"
Advisor: Dr. Andrew Ng, GPA: 3.9/4.0

Master of Science in Data Science | MIT | Cambridge, MA | 2018
Relevant Coursework: Machine Learning, Statistical Inference, Optimization, Big Data Analytics

Bachelor of Science in Mathematics | Harvard University | Cambridge, MA | 2016
Summa Cum Laude, Phi Beta Kappa, Mathematics Honor Society

PUBLICATIONS & RESEARCH
• "Deep Learning Approaches for Time Series Forecasting" - Nature Machine Intelligence 2021 (150+ citations)
• "Ethical AI in Healthcare: A Framework for Implementation" - Journal of Medical AI 2020 (200+ citations)
• "Automated Feature Engineering for Predictive Modeling" - ICML 2019 (75+ citations)
• "Interpretable Machine Learning in Clinical Decision Making" - NEJM AI 2021 (100+ citations)
• "Fairness in Algorithmic Decision Making" - ACM FAccT 2020 (125+ citations)

AWARDS & RECOGNITION
• Outstanding PhD Dissertation Award - Stanford University (2020)
• Best Paper Award - International Conference on Machine Learning (ICML) 2019
• Data Science Excellence Award - Analytics Firm (2021)
• 40 Under 40 Data Scientists - Analytics Magazine (2022)
• Rising Star Award - Women in Data Science Conference (2021)

NOTABLE PROJECTS
Healthcare Predictive Analytics Platform (2021-2022)
• Built ML platform predicting patient readmission risk with 92% accuracy
• Reduced hospital readmissions by 25% saving $5M+ in healthcare costs
• Deployed models serving 50+ hospitals with real-time predictions

E-commerce Recommendation Engine (2020-2021)
• Developed deep learning recommendation system using collaborative filtering
• Increased sales conversion by 45% and average order value by 30%
• Processed 50M+ user interactions daily with sub-100ms response time

CERTIFICATIONS
• AWS Certified Machine Learning - Specialty (2022)
• Google Cloud Professional Machine Learning Engineer (2021)
• TensorFlow Developer Certificate (2020)
• Certified Analytics Professional (CAP) (2019)`
      ];

      // Return a random sample resume for demonstration
      const randomIndex = Math.floor(Math.random() * sampleResumes.length);
      return sampleResumes[randomIndex];

    } catch (error) {
      console.error('PDF extraction error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  /**
   * Extract text from Word document
   */
  async extractFromWord(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer: buffer });
      return result.value;
    } catch (error) {
      console.error('Word extraction error:', error);
      throw new Error('Failed to extract text from Word document');
    }
  }

  /**
   * Clean extracted text
   */
  cleanText(text) {
    return text
      .replace(/\r\n/g, '\n')       // Normalize line endings
      .replace(/\t/g, ' ')          // Replace tabs with spaces
      .replace(/\s{2,}/g, ' ')      // Replace multiple spaces with single space
      .replace(/\n{3,}/g, '\n\n')   // Replace multiple newlines with double newline
      .trim();
  }

  /**
   * Extract structured information with enhanced parsing
   */
  extractStructuredInfo(text) {
    const structuredData = {
      personalInfo: this.extractPersonalInfo(text),
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      location: this.extractLocation(text),
      summary: this.extractSummary(text),
      skills: this.extractSkills(text),
      education: this.extractEducationDetailed(text),
      experience: this.extractExperienceDetailed(text),
      certifications: this.extractCertifications(text),
      projects: this.extractProjects(text),
      achievements: this.extractAchievements(text),
      sections: this.identifySections(text),
      metrics: this.extractMetrics(text),
      keywords: this.extractKeywords(text),
      languageQuality: this.analyzeLanguageQuality(text)
    };

    return structuredData;
  }

  /**
   * Extract personal information
   */
  extractPersonalInfo(text) {
    const lines = text.split('\n').slice(0, 10); // Look in first 10 lines
    const namePattern = /^[A-Z][a-z]+ [A-Z][a-z]+/;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (namePattern.test(trimmedLine) && trimmedLine.length < 50) {
        return {
          name: trimmedLine,
          line: trimmedLine
        };
      }
    }
    
    return { name: null, line: null };
  }

  /**
   * Extract location information
   */
  extractLocation(text) {
    const locationPatterns = [
      /([A-Z][a-z]+,?\s+[A-Z]{2})/g, // City, State
      /([A-Z][a-z]+,?\s+[A-Z][a-z]+)/g, // City, Country
      /(\d{5}(?:[-\s]\d{4})?)/g // ZIP codes
    ];
    
    for (const pattern of locationPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        return matches[0];
      }
    }
    
    return null;
  }

  /**
   * Extract professional summary
   */
  extractSummary(text) {
    const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      
      if (summaryKeywords.some(keyword => line.includes(keyword))) {
        // Extract next few lines as summary
        const summaryLines = [];
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const nextLine = lines[j].trim();
          if (nextLine && !this.isHeaderLine(nextLine)) {
            summaryLines.push(nextLine);
          } else if (summaryLines.length > 0) {
            break;
          }
        }
        
        if (summaryLines.length > 0) {
          return summaryLines.join(' ');
        }
      }
    }
    
    return null;
  }

  /**
   * Extract email from text
   */
  extractEmail(text) {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : null;
  }

  /**
   * Extract phone number from text
   */
  extractPhone(text) {
    const phoneRegex = /(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const matches = text.match(phoneRegex);
    return matches ? matches[0] : null;
  }

  /**
   * Extract skills from text with enhanced detection
   */
  extractSkills(text) {
    const skillCategories = {
      programming: ['JavaScript', 'Python', 'Java', 'TypeScript', 'Go', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL'],
      frontend: ['React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'SCSS', 'Sass', 'Bootstrap', 'Tailwind', 'jQuery', 'Webpack', 'Vite'],
      backend: ['Node.js', 'Express', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Ruby on Rails', 'ASP.NET', 'FastAPI', 'GraphQL'],
      databases: ['MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'Oracle', 'SQLite', 'DynamoDB'],
      cloud: ['AWS', 'Google Cloud', 'Azure', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitLab', 'GitHub Actions'],
      dataScience: ['TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Matplotlib', 'Tableau', 'Power BI', 'Jupyter'],
      marketing: ['Google Ads', 'Facebook Ads', 'SEO', 'SEM', 'Google Analytics', 'HubSpot', 'Salesforce', 'Adobe Creative Suite'],
      projectManagement: ['Agile', 'Scrum', 'Kanban', 'JIRA', 'Confluence', 'Asana', 'Trello', 'Monday.com', 'MS Project']
    };

    const foundSkills = {};
    const textUpper = text.toUpperCase();

    Object.entries(skillCategories).forEach(([category, skills]) => {
      foundSkills[category] = [];
      skills.forEach(skill => {
        if (textUpper.includes(skill.toUpperCase())) {
          foundSkills[category].push(skill);
        }
      });
    });

    // Flatten and return all found skills
    const allSkills = Object.values(foundSkills).flat();
    return allSkills;
  }

  /**
   * Extract detailed education information
   */
  extractEducationDetailed(text) {
    const educationKeywords = ['education', 'degree', 'university', 'college'];
    const section = this.findSectionContent(text, educationKeywords);
    
    if (!section) return [];
    
    const educationEntries = [];
    const lines = section.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 10) {
        const degreePattern = /(bachelor|master|phd|doctorate|associates?|diploma)/i;
        const yearPattern = /\b(19|20)\d{2}\b/g;
        const gpaPattern = /gpa:?\s*(\d\.\d)/i;
        
        if (degreePattern.test(trimmed)) {
          const years = trimmed.match(yearPattern);
          const gpaMatch = trimmed.match(gpaPattern);
          
          educationEntries.push({
            degree: trimmed,
            year: years ? years[years.length - 1] : null,
            gpa: gpaMatch ? gpaMatch[1] : null
          });
        }
      }
    }
    
    return educationEntries;
  }

  /**
   * Extract detailed experience information
   */
  extractExperienceDetailed(text) {
    const experienceKeywords = ['experience', 'work history', 'employment', 'professional experience'];
    const section = this.findSectionContent(text, experienceKeywords);
    
    if (!section) return [];
    
    const experiences = [];
    const lines = section.split('\n');
    let currentJob = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (this.isJobTitle(trimmed)) {
        if (currentJob) {
          experiences.push(currentJob);
        }
        
        currentJob = {
          title: trimmed,
          company: this.extractCompanyFromJobLine(trimmed),
          duration: this.extractDurationFromJobLine(trimmed),
          responsibilities: []
        };
      } else if (currentJob && (trimmed.startsWith('•') || trimmed.startsWith('-'))) {
        currentJob.responsibilities.push(trimmed.replace(/^[•-]\s*/, ''));
      }
    }
    
    if (currentJob) {
      experiences.push(currentJob);
    }
    
    return experiences;
  }

  /**
   * Extract certifications
   */
  extractCertifications(text) {
    const certKeywords = ['certification', 'certified', 'license', 'credential'];
    const section = this.findSectionContent(text, certKeywords);
    
    if (!section) return [];
    
    const certifications = [];
    const lines = section.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.length > 5 && (trimmed.includes('certified') || trimmed.includes('license') || trimmed.includes('AWS') || trimmed.includes('Google'))) {
        certifications.push(trimmed);
      }
    }
    
    return certifications;
  }

  /**
   * Extract projects
   */
  extractProjects(text) {
    const projectKeywords = ['projects', 'portfolio', 'work samples', 'notable projects'];
    const section = this.findSectionContent(text, projectKeywords);
    
    if (!section) return [];
    
    const projects = [];
    const lines = section.split('\n');
    let currentProject = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (trimmed && !trimmed.startsWith('•') && !trimmed.startsWith('-') && trimmed.length > 5) {
        if (currentProject) {
          projects.push(currentProject);
        }
        currentProject = {
          name: trimmed,
          description: []
        };
      } else if (currentProject && (trimmed.startsWith('•') || trimmed.startsWith('-'))) {
        currentProject.description.push(trimmed.replace(/^[•-]\s*/, ''));
      }
    }
    
    if (currentProject) {
      projects.push(currentProject);
    }
    
    return projects;
  }

  /**
   * Extract quantifiable achievements and metrics
   */
  extractMetrics(text) {
    const metrics = [];
    
    // Number patterns
    const numberPatterns = [
      /\d+%/g,                    // Percentages
      /\$[\d,]+/g,                // Dollar amounts
      /\d+[kKmMbB]/g,            // Thousands/Millions/Billions
      /\d+\s*years?/g,           // Years
      /\d+\s*months?/g,          // Months
      /\d+\+\s*(users?|customers?|clients?)/g, // Users/customers
      /improved?\s+by\s+\d+/gi,   // Improvements
      /increased?\s+by\s+\d+/gi,  // Increases
      /reduced?\s+by\s+\d+/gi,    // Reductions
    ];
    
    for (const pattern of numberPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        metrics.push(...matches);
      }
    }
    
    return [...new Set(metrics)]; // Remove duplicates
  }

  /**
   * Extract all keywords for ATS optimization
   */
  extractKeywords(text) {
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    const wordCount = {};
    
    // Count word frequency
    words.forEach(word => {
      if (!this.isStopWord(word)) {
        wordCount[word] = (wordCount[word] || 0) + 1;
      }
    });
    
    // Sort by frequency and return top keywords
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));
  }

  /**
   * Analyze language quality and style
   */
  analyzeLanguageQuality(text) {
    const actionVerbPattern = /(achieved|improved|increased|developed|led|managed|created|implemented|designed|optimized|delivered|built|established|coordinated|analyzed|executed|streamlined|enhanced|launched)/gi;
    const passiveLanguagePattern = /(responsible for|duties included|tasked with)/gi;
    
    const actionVerbs = text.match(actionVerbPattern) || [];
    const passiveLanguage = text.match(passiveLanguagePattern) || [];
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.split(' ').length, 0) / sentences.length;
    
    return {
      actionVerbCount: actionVerbs.length,
      passiveLanguageCount: passiveLanguage.length,
      averageSentenceLength: Math.round(avgSentenceLength),
      readabilityScore: this.calculateReadabilityScore(text),
      strongLanguageRatio: actionVerbs.length / (actionVerbs.length + passiveLanguage.length + 1)
    };
  }

  /**
   * Extract achievements
   */
  extractAchievements(text) {
    const achievementPatterns = [
      /won\s+[^.!?]+/gi,
      /awarded\s+[^.!?]+/gi,
      /recognized\s+[^.!?]+/gi,
      /published\s+[^.!?]+/gi,
      /led\s+[^.!?]+/gi,
      /increased\s+[^.!?]+by\s+\d+/gi,
      /improved\s+[^.!?]+by\s+\d+/gi,
      /reduced\s+[^.!?]+by\s+\d+/gi
    ];
    
    const achievements = [];
    for (const pattern of achievementPatterns) {
      const matches = text.match(pattern);
      if (matches) {
        achievements.push(...matches);
      }
    }
    
    return [...new Set(achievements)].slice(0, 10); // Top 10 unique achievements
  }

  /**
   * Identify sections in the resume
   */
  identifySections(text) {
    const sectionKeywords = {
      'Personal Info': ['contact', 'personal'],
      'Summary': ['summary', 'objective', 'profile'],
      'Experience': ['experience', 'work history', 'employment'],
      'Education': ['education', 'academic', 'qualifications'],
      'Skills': ['skills', 'technical skills', 'competencies'],
      'Projects': ['projects', 'portfolio'],
      'Certifications': ['certifications', 'licenses'],
      'Achievements': ['achievements', 'awards', 'recognition']
    };

    const foundSections = [];
    const lines = text.split('\n');

    for (const line of lines) {
      const lowerLine = line.toLowerCase().trim();
      
      Object.entries(sectionKeywords).forEach(([sectionName, keywords]) => {
        if (keywords.some(keyword => lowerLine.includes(keyword))) {
          if (!foundSections.some(section => section.name === sectionName)) {
            foundSections.push({
              name: sectionName,
              found: true,
              content: line.trim()
            });
          }
        }
      });
    }

    return foundSections;
  }

  /**
   * Get file metadata
   */
  getFileMetadata(file, structuredInfo) {
    return {
      filename: file.originalname,
      size: file.size,
      type: file.mimetype,
      uploadedAt: new Date().toISOString(),
      extractedSections: structuredInfo.sections.length,
      hasContact: !!(structuredInfo.email || structuredInfo.phone),
      hasExperience: structuredInfo.experience.length > 0,
      hasEducation: structuredInfo.education.length > 0,
      skillsCount: structuredInfo.skills.length,
      metricsCount: structuredInfo.metrics.length
    };
  }

  /**
   * Helper methods
   */
  isHeaderLine(line) {
    const headerKeywords = ['experience', 'education', 'skills', 'projects', 'certifications'];
    return headerKeywords.some(keyword => line.toLowerCase().includes(keyword));
  }

  isJobTitle(line) {
    const jobIndicators = ['|', ' at ', 'engineer', 'manager', 'developer', 'analyst', 'specialist', 'coordinator', 'director', 'lead'];
    return jobIndicators.some(indicator => line.toLowerCase().includes(indicator));
  }

  extractCompanyFromJobLine(line) {
    const parts = line.split('|');
    return parts.length > 1 ? parts[1].trim() : null;
  }

  extractDurationFromJobLine(line) {
    const yearPattern = /\b(19|20)\d{2}\b/g;
    const matches = line.match(yearPattern);
    return matches ? matches.join(' - ') : null;
  }

  findSectionContent(text, keywords) {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = -1;

    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (keywords.some(keyword => line.includes(keyword))) {
        sectionStart = i + 1;
        break;
      }
    }

    if (sectionStart === -1) return null;

    // Find section end (next major section or end of text)
    const majorSections = ['experience', 'education', 'skills', 'projects', 'certifications'];
    for (let i = sectionStart; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (majorSections.some(section => line.includes(section)) && i > sectionStart) {
        sectionEnd = i;
        break;
      }
    }

    if (sectionEnd === -1) sectionEnd = lines.length;

    return lines.slice(sectionStart, sectionEnd).join('\n');
  }

  isStopWord(word) {
    const stopWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
    return stopWords.includes(word);
  }

  calculateReadabilityScore(text) {
    // Simple readability calculation based on sentence and word length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    const avgCharsPerWord = words.reduce((acc, word) => acc + word.length, 0) / words.length;
    
    // Scale to 0-100 (higher is more readable)
    return Math.max(0, Math.min(100, 100 - (avgWordsPerSentence * 2) - (avgCharsPerWord * 3)));
  }
}

export default FileProcessorEnhanced;
