import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testFullAnalysis() {
  try {
    console.log('Testing Full Enhanced Analysis Pipeline...\n');
    
    // Create a mock resume file
    const resumeContent = `John Smith
Senior Software Engineer
john.smith@email.com | (555) 123-4567 | San Francisco, CA

PROFESSIONAL SUMMARY
Results-driven senior software engineer with 8+ years of experience in full-stack web development. 
Proven track record of delivering scalable applications and leading development teams.

EXPERIENCE
Senior Software Engineer | TechCorp Inc. | 2020-Present
• Architected and developed microservices serving 500,000+ daily active users
• Improved application performance by 60% through optimization and caching
• Led cross-functional team of 5 developers on enterprise projects
• Mentored junior developers and conducted code reviews

Software Engineer | StartupXYZ | 2018-2020
• Built RESTful APIs using Node.js, Express, and MongoDB
• Implemented CI/CD pipelines reducing deployment time by 45%
• Developed React components for customer-facing dashboard

EDUCATION
Bachelor of Science in Computer Science | Stanford University | 2016
GPA: 3.8/4.0, Dean's List

TECHNICAL SKILLS
Languages: JavaScript, Python, Java, TypeScript
Frontend: React, Vue.js, Angular, HTML5, CSS3
Backend: Node.js, Express, Django
Databases: MongoDB, PostgreSQL, MySQL
Cloud: AWS, Google Cloud, Docker, Kubernetes

CERTIFICATIONS
• AWS Certified Solutions Architect
• Google Cloud Professional Developer`;

    // Create temporary file
    fs.writeFileSync('temp_resume.txt', resumeContent);
    
    const formData = new FormData();
    formData.append('resume', fs.createReadStream('temp_resume.txt'));
    formData.append('jobIndustry', 'technology');
    formData.append('jobLevel', 'senior');
    formData.append('jobTitle', 'Senior Software Engineer');
    
    const response = await axios.post('http://localhost:5000/api/analysis/upload', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer your-test-token' // You'd need a valid token
      }
    });
    
    console.log('=== API RESPONSE ===');
    console.log('Success:', response.data.success);
    console.log('Overall Score:', response.data.data.overallScore);
    console.log('Grade:', response.data.data.grade);
    
    if (response.data.data.structuredData) {
      console.log('\n=== STRUCTURED DATA ===');
      console.log('Personal Info:', response.data.data.structuredData.personalInfo);
      console.log('Contact Info:', response.data.data.structuredData.contactInfo);
      console.log('Skills:', response.data.data.structuredData.skills?.slice(0, 5));
      console.log('Metrics:', response.data.data.structuredData.metrics?.slice(0, 5));
      console.log('Language Quality:', response.data.data.structuredData.languageQuality);
    }
    
    if (response.data.data.expertReview) {
      console.log('\n=== EXPERT REVIEW ===');
      console.log('Summary:', response.data.data.expertReview.summary);
      console.log('Top Strengths:', response.data.data.expertReview.topStrengths);
      console.log('Top Weaknesses:', response.data.data.expertReview.topWeaknesses);
    }
    
    // Clean up
    fs.unlinkSync('temp_resume.txt');
    
    console.log('\nFull Analysis Test Complete! ✅');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
    // Clean up on error
    try {
      fs.unlinkSync('temp_resume.txt');
    } catch {}
  }
}

testFullAnalysis();
