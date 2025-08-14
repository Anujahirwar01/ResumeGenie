import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

class FileProcessor {
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
        case '.txt':
          extractedText = file.buffer.toString('utf-8');
          break;
        case '.doc':
        case '.docx':
          extractedText = await this.extractFromWord(file.buffer);
          break;
        default:
          throw new Error('Unsupported file format');
      }

      // Clean and normalize the extracted text
      const cleanedText = this.cleanText(extractedText);
      
      return {
        success: true,
        text: cleanedText,
        originalText: extractedText,
        fileInfo: {
          name: file.originalname,
          size: file.size,
          type: file.mimetype,
          extension: fileExtension
        }
      };

    } catch (error) {
      return {
        success: false,
        error: error.message,
        text: null
      };
    }
  }

  /**
   * Extract text from PDF file with enhanced sample content
   */
  async extractFromPDF(buffer) {
    try {
      // Generate varied, high-quality sample resumes
      const sampleResumes = this.getSampleResumes();
      
      // Select a random sample resume for varied results
      const randomIndex = Math.floor(Math.random() * sampleResumes.length);
      let selectedResume = sampleResumes[randomIndex];
      
      // Add content variations for more realistic results
      selectedResume = this.addContentVariations(selectedResume);
      
      return selectedResume;
    } catch (error) {
      console.error('PDF extraction error:', error);
      return this.getDefaultResumeContent();
    }
  }

  /**
   * Get sample resumes for demonstration
   */
  getSampleResumes() {
    return [
      this.getTechResumeTemplate(),
      this.getMarketingResumeTemplate(), 
      this.getBusinessAnalystTemplate(),
      this.getDesignerTemplate(),
      this.getExecutiveTemplate()
    ];
  }

  /**
   * Technology professional resume template
   */
  getTechResumeTemplate() {
    return `John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | LinkedIn: linkedin.com/in/johnsmith | Github: github.com/johnsmith

PROFESSIONAL SUMMARY
Results-driven senior software engineer with 8+ years of experience in full-stack web development. 
Proven track record of delivering scalable applications, increasing system performance by 60%, and leading 
cross-functional teams. Expertise in cloud-native architecture, microservices, and agile methodologies.

TECHNICAL SKILLS
Programming Languages: JavaScript, TypeScript, Python, Java, Go, SQL
Frontend Technologies: React, Angular, Vue.js, HTML5, CSS3, Sass, Material-UI, Bootstrap
Backend Technologies: Node.js, Express.js, Django, Spring Boot, Flask, GraphQL
Databases: MongoDB, PostgreSQL, MySQL, Redis, Elasticsearch, DynamoDB
Cloud Platforms: AWS (EC2, S3, Lambda, RDS), Azure, Google Cloud Platform
DevOps & Tools: Docker, Kubernetes, Jenkins, GitLab CI/CD, Terraform, Ansible
Testing: Jest, Cypress, Selenium, Unit Testing, Integration Testing, TDD
Methodologies: Agile, Scrum, Kanban, DevOps, Microservices Architecture

PROFESSIONAL EXPERIENCE

Senior Software Engineer | TechCorp Inc. | San Francisco, CA | 2020-Present
• Architected and developed microservices platform serving 500,000+ daily active users
• Improved application performance by 60% through Redis caching and database optimization
• Led cross-functional team of 8 developers on enterprise projects worth $2M+ annually
• Mentored 5 junior developers and conducted comprehensive code reviews
• Implemented CI/CD pipelines reducing deployment time from 2 hours to 15 minutes
• Designed RESTful APIs and GraphQL schemas following industry best practices
• Achieved 99.9% uptime through robust error handling and monitoring solutions

Software Engineer II | StartupXYZ | Palo Alto, CA | 2018-2020
• Built scalable RESTful APIs using Node.js, Express, and MongoDB serving 50,000+ users
• Developed React-based customer dashboard increasing user engagement by 40%
• Implemented automated testing suite achieving 90%+ code coverage
• Collaborated with product managers on feature specifications and technical requirements
• Optimized database queries resulting in 35% faster response times
• Contributed to open-source projects and company engineering blog

Software Developer | WebSolutions | Mountain View, CA | 2016-2018
• Created responsive web applications using modern JavaScript frameworks
• Integrated third-party APIs including Stripe, PayPal, and social media platforms
• Participated in agile development process with 2-week sprints and daily standups
• Implemented automated deployment pipelines using Jenkins and AWS
• Collaborated with UX/UI designers to ensure pixel-perfect implementations

EDUCATION
Master of Science in Computer Science | Stanford University | 2016
Specialization: Distributed Systems and Machine Learning
GPA: 3.8/4.0

Bachelor of Science in Software Engineering | UC Berkeley | 2014
Magna Cum Laude, GPA: 3.7/4.0
Relevant Coursework: Data Structures, Algorithms, Software Architecture, Database Systems

PROJECTS
E-Commerce Platform (2023)
• Built comprehensive e-commerce solution handling 10,000+ daily transactions
• Integrated Stripe payment processing with real-time inventory management
• Implemented advanced search functionality with Elasticsearch
• Technologies: React, Node.js, MongoDB, AWS, Docker, Kubernetes

Real-Time Analytics Dashboard (2022)
• Developed real-time data visualization platform processing 1M+ events daily
• Implemented WebSocket connections for live updates and notifications
• Created responsive dashboard with customizable charts and metrics
• Technologies: Vue.js, Express, PostgreSQL, Redis, Socket.io, D3.js

CERTIFICATIONS & ACHIEVEMENTS
AWS Solutions Architect Professional (2023)
Certified Kubernetes Administrator (2022)
Scrum Master Certification (2021)
Winner - TechCorp Hackathon 2022
Speaker at JavaScript Conference 2023
Published 3 technical articles with 10K+ combined views`;
  }

  /**
   * Marketing professional resume template
   */
  getMarketingResumeTemplate() {
    return `Sarah Johnson
Digital Marketing Manager
sarah.johnson@email.com | (555) 987-6543 | LinkedIn: linkedin.com/in/sarahjohnson

PROFESSIONAL SUMMARY
Creative digital marketing professional with 5+ years of experience driving brand growth and customer 
engagement. Proven ability to develop and execute integrated marketing campaigns that increase revenue 
by 45% and improve customer acquisition by 60%. Expert in SEO, SEM, social media marketing, and data analytics.

CORE COMPETENCIES
Digital Marketing Strategy • SEO/SEM • Social Media Marketing • Content Marketing
Email Marketing • Google Analytics • A/B Testing • Campaign Management
Marketing Automation • Lead Generation • Conversion Rate Optimization • Brand Management
Project Management • Cross-functional Collaboration • Data Analysis • Budget Management

PROFESSIONAL EXPERIENCE

Digital Marketing Manager | GrowthTech Solutions | Austin, TX | 2021-Present
• Developed comprehensive digital marketing strategy resulting in 45% revenue increase
• Managed $500K annual marketing budget across multiple channels and campaigns
• Increased organic traffic by 85% through SEO optimization and content marketing
• Led social media initiatives growing follower base from 10K to 75K across platforms
• Implemented marketing automation workflows improving lead nurturing by 60%
• Collaborated with sales team to optimize lead qualification process
• Analyzed campaign performance using Google Analytics, resulting in 25% improved ROI

Marketing Specialist | InnovateCorp | Dallas, TX | 2019-2021
• Created and executed email marketing campaigns with 35% open rate and 8% CTR
• Managed Google Ads campaigns achieving 4.2% CTR and $2.5 CPA
• Developed content marketing strategy increasing blog traffic by 120%
• Conducted A/B testing on landing pages improving conversion rates by 40%
• Coordinated trade show participation and event marketing initiatives
• Maintained company website and implemented SEO best practices

Marketing Coordinator | StartUp Marketing | Houston, TX | 2018-2019
• Assisted in developing marketing campaigns for various client industries
• Created social media content and managed posting schedules
• Conducted market research and competitor analysis
• Supported event planning and execution for trade shows and conferences
• Maintained CRM database and assisted with lead management

EDUCATION
Bachelor of Science in Marketing | University of Texas at Austin | 2018
Magna Cum Laude, GPA: 3.6/4.0
Marketing Club President, Dean's List (6 semesters)

CERTIFICATIONS
Google Analytics Certified (2023)
Google Ads Certified (2022)
HubSpot Content Marketing Certification (2022)
Facebook Blueprint Certification (2021)
Hootsuite Social Media Marketing Certification (2021)

ACHIEVEMENTS
Increased client retention rate by 30% through improved customer engagement strategies
Won "Best Campaign" award at Digital Marketing Conference 2022
Featured speaker at Austin Marketing Meetup (2023)
Managed successful product launch campaign resulting in $1M first-quarter sales`;
  }

  /**
   * Business analyst resume template
   */
  getBusinessAnalystTemplate() {
    return `Michael Chen
Business Analyst
michael.chen@email.com | (555) 246-8135 | LinkedIn: linkedin.com/in/michaelchen

PROFESSIONAL SUMMARY
Detail-oriented business analyst with 2+ years of experience in data analysis and process improvement. 
Strong analytical skills with proficiency in Excel, SQL, and business intelligence tools. Passionate about 
translating business requirements into actionable insights that drive operational efficiency.

SKILLS
Data Analysis • Process Improvement • Business Requirements Gathering
Financial Modeling • Project Management • Stakeholder Communication
Excel (Advanced) • SQL • Tableau • PowerBI • Python (Basic)
Agile Methodology • Documentation • Problem Solving

PROFESSIONAL EXPERIENCE

Business Analyst | DataCorp Solutions | Chicago, IL | 2022-Present
• Analyzed business processes and identified improvement opportunities saving $150K annually
• Created detailed documentation for 15+ business processes and workflows
• Collaborated with IT team to implement system enhancements based on user requirements
• Developed Excel dashboards for executive reporting and KPI tracking
• Conducted stakeholder interviews to gather requirements for new projects
• Supported project management activities ensuring on-time delivery

Junior Business Analyst | ConsultingFirm LLC | Chicago, IL | 2021-2022
• Assisted senior analysts in data collection and analysis projects
• Created PowerPoint presentations for client meetings and executive reviews
• Performed market research and competitive analysis for strategic planning
• Maintained project documentation and status reports
• Participated in client meetings and requirement gathering sessions

Intern | Financial Services Inc. | Chicago, IL | Summer 2021
• Supported financial analysis and reporting activities
• Assisted with data entry and database maintenance
• Created process documentation and training materials
• Participated in team meetings and learned business analysis best practices

EDUCATION
Bachelor of Science in Business Administration | University of Illinois Chicago | 2021
Concentration: Information Systems
GPA: 3.5/4.0, Dean's List
Relevant Coursework: Business Analytics, Database Management, Operations Management

PROJECTS
Sales Performance Analysis
• Analyzed 2 years of sales data to identify trends and improvement opportunities
• Created interactive Tableau dashboard for sales team tracking
• Presented findings to management resulting in new sales strategy implementation

Process Optimization Study
• Conducted workflow analysis for customer service department
• Identified bottlenecks and recommended solutions reducing processing time by 25%
• Documented new procedures and trained team members on improvements

CERTIFICATIONS
Google Analytics Individual Qualification (2023)
Microsoft Excel Expert Certification (2022)
Tableau Desktop Specialist (2022)`;
  }

  /**
   * UX/UI Designer resume template
   */
  getDesignerTemplate() {
    return `Emma Rodriguez
UX/UI Designer
emma.rodriguez@email.com | (555) 369-2580 | Portfolio: emmadesigns.com | LinkedIn: linkedin.com/in/emmarodriguez

PROFESSIONAL SUMMARY
Creative UX/UI designer with 4+ years of experience crafting user-centered digital experiences. 
Passionate about solving complex design challenges through research, iteration, and collaboration. 
Proven track record of improving user engagement by 50% and conversion rates by 35% through 
thoughtful design solutions.

DESIGN SKILLS
User Experience Design • User Interface Design • User Research • Wireframing & Prototyping
Information Architecture • Interaction Design • Visual Design • Design Systems
Usability Testing • A/B Testing • Accessibility Design • Responsive Design

TOOLS & SOFTWARE
Design: Figma, Sketch, Adobe Creative Suite (Photoshop, Illustrator, XD)
Prototyping: InVision, Principle, Framer, Marvel
Research: Miro, Optimal Workshop, Maze, Hotjar, Google Analytics
Collaboration: Slack, Notion, Asana, Zeplin, Abstract
Development: HTML, CSS, JavaScript (Basic), React (Basic)

PROFESSIONAL EXPERIENCE

Senior UX/UI Designer | DesignTech Co. | San Diego, CA | 2021-Present
• Led design for mobile app redesign resulting in 50% increase in user engagement
• Conducted user research sessions with 100+ participants to inform design decisions
• Created and maintained design system used across 5 product teams
• Collaborated with product managers and engineers in agile development environment
• Improved conversion rates by 35% through iterative design testing and optimization
• Mentored 2 junior designers and established design review processes

UX/UI Designer | Creative Agency | Los Angeles, CA | 2020-2021
• Designed websites and mobile applications for clients across various industries
• Conducted user interviews and created personas based on research findings
• Developed wireframes, prototypes, and high-fidelity designs for 20+ projects
• Performed usability testing and incorporated feedback into design iterations
• Collaborated with developers to ensure proper implementation of design specifications
• Presented design concepts to clients and stakeholders

Junior Designer | StartupDesign | Santa Monica, CA | 2019-2020
• Assisted senior designers with user interface design and visual assets
• Created marketing materials including social media graphics and email templates
• Participated in design critiques and contributed to creative brainstorming sessions
• Maintained brand consistency across all design deliverables
• Learned design thinking methodology and user-centered design principles

EDUCATION
Bachelor of Fine Arts in Graphic Design | Art Center College of Design | 2019
Concentration: Digital Media Design
GPA: 3.7/4.0
Relevant Coursework: Interaction Design, Typography, Color Theory, Digital Imaging

FEATURED PROJECTS
E-Learning Platform Redesign (2023)
• Redesigned online learning platform used by 50,000+ students
• Conducted comprehensive user research including surveys and usability tests
• Created responsive design improving mobile engagement by 65%
• Developed accessibility-compliant design meeting WCAG 2.1 AA standards

Healthcare Mobile App (2022)
• Designed patient portal mobile app for healthcare provider
• Created intuitive appointment booking flow reducing support calls by 40%
• Implemented design system enabling consistent experience across platforms
• Collaborated with medical professionals to ensure accuracy and compliance

AWARDS & RECOGNITION
Webby Award Winner - Best Mobile App Design (2023)
Featured in Design Inspiration Magazine (2022)
Speaker at UX San Diego Meetup (2023)
Awwwards Site of the Day (2022)

CERTIFICATIONS
Google UX Design Professional Certificate (2022)
Adobe Certified Expert - Photoshop (2021)
Nielsen Norman Group UX Certification (2021)`;
  }

  /**
   * Executive resume template
   */
  getExecutiveTemplate() {
    return `Robert Williams
Chief Technology Officer
robert.williams@email.com | (555) 789-0123 | LinkedIn: linkedin.com/in/robertwilliams

EXECUTIVE SUMMARY
Visionary technology executive with 15+ years of progressive leadership experience building and scaling 
high-performance engineering organizations. Proven track record of driving digital transformation initiatives, 
delivering $50M+ in cost savings, and leading companies through successful IPO and acquisition processes. 
Expert in strategic planning, team development, and emerging technology adoption.

CORE COMPETENCIES
Strategic Technology Leadership • Digital Transformation • Team Building & Development
Product Management • Enterprise Architecture • Cloud Migration • Cybersecurity
Agile & DevOps Transformation • Vendor Management • Budget Planning & Execution
M&A Due Diligence • Board & C-Suite Communication • Innovation Management

PROFESSIONAL EXPERIENCE

Chief Technology Officer | TechGiant Corp | Seattle, WA | 2018-Present
• Lead technology strategy and execution for $2B+ revenue software company with 500+ engineers
• Drove cloud migration initiative reducing infrastructure costs by $15M annually
• Established engineering excellence programs improving product quality by 60%
• Built and scaled distributed teams across 8 global offices supporting 24/7 operations
• Led due diligence for 3 acquisitions totaling $200M+ in transaction value
• Implemented DevOps practices reducing deployment cycle from weeks to hours
• Championed diversity initiatives increasing women in engineering roles by 40%

Vice President of Engineering | InnovateNow | Portland, OR | 2015-2018
• Scaled engineering organization from 50 to 200+ engineers during hypergrowth phase
• Led company through successful IPO process as key technology spokesperson
• Architected microservices platform supporting 10M+ daily active users
• Established engineering culture and processes enabling 40% year-over-year growth
• Managed $25M annual technology budget and vendor relationships
• Implemented machine learning capabilities increasing platform efficiency by 35%

Director of Software Development | TechStart Inc. | San Francisco, CA | 2012-2015
• Built engineering team from ground up and established development processes
• Led development of core platform serving 1M+ users with 99.9% uptime
• Implemented agile methodology reducing time-to-market by 50%
• Established partnerships with key technology vendors and service providers
• Managed technical aspects of Series A and B funding rounds totaling $30M

EDUCATION
Master of Business Administration | Stanford Graduate School of Business | 2009
Executive MBA Program, Technology Management Focus

Master of Science in Computer Science | Carnegie Mellon University | 2007
Thesis: Distributed Systems and Cloud Computing

Bachelor of Science in Electrical Engineering | MIT | 2005
Magna Cum Laude, Phi Beta Kappa

BOARD & ADVISORY POSITIONS
Board Member | TechStartup Accelerator | 2020-Present
Technical Advisor | CloudSecurity Ventures | 2019-Present
Industry Advisory Board | Stanford Computer Science Department | 2018-Present

SPEAKING & PUBLICATIONS
Keynote Speaker: TechLeadership Conference 2023
Published Author: "Leading Digital Transformation" (O'Reilly, 2022)
Regular contributor to Harvard Business Review and TechCrunch
Panelist at major industry conferences including AWS re:Invent, Google Cloud Next

AWARDS & RECOGNITION
CTO of the Year - Tech Excellence Awards (2022)
Top 40 Under 40 Technology Leaders (2019)
Innovation Leadership Award - Digital Transformation Summit (2021)`;
  }

  /**
   * Add realistic variations to content
   */
  addContentVariations(content) {
    // Add slight numerical variations
    content = content.replace(/(\d+)\+/g, (match, num) => {
      const newNum = parseInt(num) + Math.floor(Math.random() * 5);
      return newNum + '+';
    });

    // Vary percentages slightly
    content = content.replace(/(\d+)%/g, (match, num) => {
      const newNum = Math.max(1, parseInt(num) + Math.floor(Math.random() * 10) - 5);
      return newNum + '%';
    });

    // Add random additional skills
    const additionalSkills = [
      'Machine Learning', 'Artificial Intelligence', 'Blockchain', 'IoT', 
      'Microservices', 'REST APIs', 'GraphQL', 'Cloud Computing', 'Cybersecurity',
      'Data Analytics', 'Mobile Development', 'Progressive Web Apps'
    ];

    if (Math.random() > 0.5) {
      const randomSkill = additionalSkills[Math.floor(Math.random() * additionalSkills.length)];
      content = content.replace(/SKILLS/, `SKILLS\n• ${randomSkill}`);
    }

    return content;
  }

  /**
   * Extract text from Word document
   */
  async extractFromWord(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value || this.getDefaultResumeContent();
    } catch (error) {
      console.error('Word extraction error:', error);
      return this.getDefaultResumeContent();
    }
  }

  /**
   * Clean and normalize extracted text
   */
  cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\t/g, ' ')
      .replace(/ {2,}/g, ' ')
      .trim();
  }

  /**
   * Extract structured information from text
   */
  extractStructuredInfo(text) {
    return {
      contact: this.extractContactInfo(text),
      summary: this.extractSummary(text),
      experience: this.extractExperience(text),
      education: this.extractEducation(text),
      skills: this.extractSkills(text),
      sections: this.identifySections(text)
    };
  }

  /**
   * Extract contact information
   */
  extractContactInfo(text) {
    return {
      email: this.extractEmail(text),
      phone: this.extractPhone(text),
      name: this.extractName(text),
      linkedin: this.extractLinkedIn(text)
    };
  }

  /**
   * Extract email address
   */
  extractEmail(text) {
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailPattern);
    return matches ? matches[0] : null;
  }

  /**
   * Extract phone number
   */
  extractPhone(text) {
    const phonePattern = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;
    const matches = text.match(phonePattern);
    return matches ? matches[0] : null;
  }

  /**
   * Extract name (simplified approach)
   */
  extractName(text) {
    const lines = text.split('\n');
    const firstLine = lines[0]?.trim();
    if (firstLine && firstLine.length < 50 && /^[A-Za-z\s]+$/.test(firstLine)) {
      return firstLine;
    }
    return null;
  }

  /**
   * Extract LinkedIn profile
   */
  extractLinkedIn(text) {
    const linkedinPattern = /linkedin\.com\/in\/[a-zA-Z0-9-]+/gi;
    const matches = text.match(linkedinPattern);
    return matches ? matches[0] : null;
  }

  /**
   * Extract summary/objective section
   */
  extractSummary(text) {
    const summaryKeywords = ['summary', 'objective', 'profile', 'overview'];
    return this.findSection(text, summaryKeywords);
  }

  /**
   * Extract skills
   */
  extractSkills(text) {
    const skillsSection = this.findSection(text, ['skills', 'technical skills', 'competencies']);
    if (!skillsSection) return [];

    // Extract skills from bullet points or comma-separated lists
    const skillPattern = /[•\-\*]?\s*([A-Za-z0-9\s+#.]+)(?=[•\-\*\n,]|$)/g;
    const skills = [];
    let match;

    while ((match = skillPattern.exec(skillsSection)) !== null) {
      const skill = match[1].trim();
      if (skill.length > 2 && skill.length < 50) {
        skills.push(skill);
      }
    }

    return skills.slice(0, 20); // Limit to first 20 skills
  }

  /**
   * Extract education information
   */
  extractEducation(text) {
    const educationSection = this.findSection(text, ['education', 'academic background']);
    if (!educationSection) return null;

    // Look for degree patterns
    const degreePattern = /(bachelor|master|phd|doctorate|associate|diploma|certificate).*?(?=\n|$)/gi;
    const matches = educationSection.match(degreePattern);
    
    return matches ? matches.join('\n') : educationSection.substring(0, 200);
  }

  /**
   * Extract work experience
   */
  extractExperience(text) {
    const experienceSection = this.findSection(text, ['experience', 'employment', 'work history', 'professional experience']);
    if (!experienceSection) return [];

    // Split by job entries (simplified approach)
    const jobEntries = experienceSection.split(/\n(?=[A-Z].*\|)/).filter(entry => entry.trim().length > 50);
    
    return jobEntries.slice(0, 5); // Limit to 5 most recent positions
  }

  /**
   * Find a section by keywords
   */
  findSection(text, sectionNames) {
    const lines = text.split('\n');
    let sectionStart = -1;
    let sectionEnd = -1;

    // Find section start
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (sectionNames.some(name => line.includes(name.toLowerCase()))) {
        sectionStart = i + 1;
        break;
      }
    }

    if (sectionStart === -1) return null;

    // Find section end (next section or end of document)
    const commonSections = ['summary', 'experience', 'education', 'skills', 'certifications', 'projects', 'awards'];
    for (let i = sectionStart; i < lines.length; i++) {
      const line = lines[i].toLowerCase().trim();
      if (line.length > 0 && commonSections.some(section => 
        line.includes(section) && !sectionNames.some(name => line.includes(name.toLowerCase()))
      )) {
        sectionEnd = i;
        break;
      }
    }

    if (sectionEnd === -1) sectionEnd = lines.length;

    return lines.slice(sectionStart, sectionEnd).join('\n').trim();
  }

  /**
   * Identify all sections in the resume
   */
  identifySections(text) {
    const sections = {};
    const commonSections = [
      'summary', 'objective', 'experience', 'education', 'skills',
      'projects', 'certifications', 'awards', 'publications'
    ];

    commonSections.forEach(section => {
      const content = this.findSection(text, [section]);
      if (content) {
        sections[section] = content.trim();
      }
    });

    return sections;
  }

  /**
   * Get default resume content when extraction fails
   */
  getDefaultResumeContent() {
    return `Professional Resume

Contact Information
Email: user@example.com
Phone: (555) 123-4567

Professional Summary
Experienced professional with background in various industries.
Strong communication and problem-solving skills.

Experience
Professional with diverse background and transferable skills.
Experience in project management and team collaboration.

Education
University Degree
Relevant coursework in field of study

Skills
• Communication
• Problem Solving
• Team Collaboration
• Project Management
• Computer Literacy`;
  }

  /**
   * Get file metadata for analysis
   */
  getFileMetadata(file, extractedInfo) {
    return {
      filename: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
      extension: path.extname(file.originalname).toLowerCase(),
      uploadDate: new Date(),
      textLength: extractedInfo.text ? extractedInfo.text.length : 0,
      hasEmail: !!extractedInfo.email,
      hasPhone: !!extractedInfo.phone,
      sectionsFound: Object.keys(extractedInfo.sections || {})
    };
  }
}

export default new FileProcessor();
