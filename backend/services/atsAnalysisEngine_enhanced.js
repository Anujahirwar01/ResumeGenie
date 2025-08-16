import { KeywordDatabase } from '../models/index.js';

class ATSAnalysisEngine {
  constructor() {
    this.weights = {
      keywords: 0.35,        // 35% - Keyword relevance and density
      formatting: 0.25,     // 25% - ATS-friendly formatting
      content: 0.25,        // 25% - Content quality and completeness
      structure: 0.15       // 15% - Resume structure and organization
    };

    this.passingScore = 70; // Minimum score to be considered ATS-friendly
    
    // Enhanced scoring criteria
    this.scoringCriteria = {
      keywords: {
        excellent: 90,
        good: 75,
        average: 60,
        poor: 40
      },
      formatting: {
        excellent: 95,
        good: 80,
        average: 65,
        poor: 45
      },
      content: {
        excellent: 92,
        good: 78,
        average: 62,
        poor: 42
      },
      structure: {
        excellent: 88,
        good: 72,
        average: 58,
        poor: 38
      }
    };
  }

  /**
   * Main analysis function - analyzes resume like an expert technical recruiter
   */
  async analyzeResume(extractedText, structuredInfo, jobIndustry = 'technology', jobLevel = 'mid') {
    try {
      const analysis = {
        overallScore: 0,
        grade: '',
        categoryScores: {},
        details: {},
        strengths: [],
        weaknesses: [],
        suggestions: [],
        sectionFeedback: {
          structure: '',
          content: '',
          ats: '',
          relevance: ''
        },
        expertReview: {
          summary: '',
          topStrengths: [],
          topWeaknesses: [],
          actionableImprovements: [],
          rewrittenBullets: []
        },
        scores: {
          structureFormatting: 0,
          contentQuality: 0,
          atsOptimization: 0,
          overallImpact: 0
        }
      };

      // 1. Structure & Formatting Analysis
      const structureResults = this.analyzeStructureFormatting(extractedText, structuredInfo);
      analysis.scores.structureFormatting = structureResults.score;
      analysis.sectionFeedback.structure = structureResults.feedback;

      // 2. Content Quality Analysis
      const contentResults = this.analyzeContentQuality(extractedText, structuredInfo, jobLevel);
      analysis.scores.contentQuality = contentResults.score;
      analysis.sectionFeedback.content = contentResults.feedback;

      // 3. ATS Optimization Analysis
      const atsResults = await this.analyzeATSOptimization(extractedText, jobIndustry, jobLevel);
      analysis.scores.atsOptimization = atsResults.score;
      analysis.sectionFeedback.ats = atsResults.feedback;

      // 4. Relevance Analysis
      const relevanceResults = this.analyzeRelevance(extractedText, structuredInfo, jobIndustry, jobLevel);
      analysis.scores.overallImpact = relevanceResults.score;
      analysis.sectionFeedback.relevance = relevanceResults.feedback;

      // 5. Generate Expert Review
      analysis.expertReview = this.generateExpertReview(analysis, extractedText, structuredInfo);

      // 6. Calculate Overall Score
      analysis.overallScore = Math.round(
        (analysis.scores.structureFormatting + 
         analysis.scores.contentQuality + 
         analysis.scores.atsOptimization + 
         analysis.scores.overallImpact) / 4
      );
      analysis.grade = this.calculateGrade(analysis.overallScore);

      return analysis;

    } catch (error) {
      console.error('ATS Analysis error:', error);
      throw new Error(`Analysis failed: ${error.message}`);
    }
  }

  /**
   * Structure & Formatting Analysis - Expert Recruiter Perspective
   */
  analyzeStructureFormatting(text, structuredInfo) {
    let score = 0;
    let feedback = "";
    const issues = [];
    const strengths = [];

    // 1. Resume Length Analysis (more dynamic)
    const wordCount = text.split(/\s+/).length;
    const lineCount = text.split('\n').length;
    
    if (wordCount >= 400 && wordCount <= 600) {
      score += 25;
      strengths.push("Optimal resume length for readability and completeness");
    } else if (wordCount >= 300 && wordCount <= 400) {
      score += 20;
      strengths.push("Good resume length, could add more detail");
    } else if (wordCount < 300) {
      score += 10;
      issues.push(`Resume too brief (${wordCount} words) - add more achievement details`);
    } else if (wordCount > 800) {
      score += 12;
      issues.push(`Resume too lengthy (${wordCount} words) - focus on most relevant experiences`);
    } else {
      score += 18;
      issues.push("Consider optimizing resume length for better impact");
    }

    // 2. Section Organization (analyze actual content)
    const sections = structuredInfo.sections || [];
    const sectionTypes = sections.map(s => s.type);
    const hasContact = text.toLowerCase().includes('@') || text.toLowerCase().includes('phone');
    const hasSummary = text.toLowerCase().includes('summary') || text.toLowerCase().includes('objective');
    const hasExperience = sectionTypes.includes('experience') || text.toLowerCase().includes('experience');
    const hasSkills = sectionTypes.includes('skills') || text.toLowerCase().includes('skills');
    const hasEducation = sectionTypes.includes('education') || text.toLowerCase().includes('education');
    
    let sectionScore = 0;
    if (hasContact) sectionScore += 5;
    if (hasSummary) sectionScore += 5;
    if (hasExperience) sectionScore += 8;
    if (hasSkills) sectionScore += 4;
    if (hasEducation) sectionScore += 3;
    
    score += sectionScore;
    
    if (sectionScore >= 20) {
      strengths.push("Comprehensive section organization with all key components");
    } else if (sectionScore >= 15) {
      strengths.push("Good section structure, minor components missing");
    } else {
      issues.push(`Missing essential sections (${hasExperience ? '' : 'Experience, '}${hasSkills ? '' : 'Skills, '}${hasSummary ? '' : 'Summary'})`);
    }

    // 3. Formatting Consistency (analyze actual formatting patterns)
    const lines = text.split('\n');
    const bulletPoints = lines.filter(line => line.trim().match(/^[•▪▫◦‣⁃\-*]/));
    const numberedLists = lines.filter(line => line.trim().match(/^\d+\./));
    const allCapsLines = lines.filter(line => line.trim().length > 3 && line.trim() === line.trim().toUpperCase());
    
    let formatScore = 15;
    
    if (bulletPoints.length > 5) {
      formatScore += 5;
      strengths.push("Excellent use of bullet points for readability");
    } else if (bulletPoints.length > 2) {
      formatScore += 2;
      strengths.push("Good use of bullet points");
    } else {
      formatScore -= 3;
      issues.push("Use more bullet points to improve readability");
    }
    
    if (allCapsLines.length > 0 && allCapsLines.length <= 5) {
      formatScore += 2;
      strengths.push("Good use of headers for section separation");
    }
    
    score += Math.min(20, formatScore);

    // 4. Professional Presentation (content-specific analysis)
    let presentationScore = 10;
    
    // Check for professional email
    const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
    if (emailMatch && !emailMatch[0].includes('hotmail') && !emailMatch[0].includes('yahoo')) {
      presentationScore += 3;
      strengths.push("Professional email address");
    } else if (emailMatch) {
      presentationScore += 1;
      issues.push("Consider using a more professional email address");
    }
    
    // Check for LinkedIn or portfolio
    if (text.toLowerCase().includes('linkedin') || text.toLowerCase().includes('github')) {
      presentationScore += 2;
      strengths.push("Includes professional online presence");
    }
    
    score += Math.min(15, presentationScore);

    // 5. ATS-Friendly Formatting (dynamic analysis)
    let atsScore = 15;
    const unfriendlyElements = [];
    
    if (text.includes('|')) {
      unfriendlyElements.push('pipe characters');
      atsScore -= 3;
    }
    if (text.includes('\t')) {
      unfriendlyElements.push('tab characters');
      atsScore -= 2;
    }
    if (text.match(/[^\x00-\x7F]/g)?.length > 10) {
      unfriendlyElements.push('special characters');
      atsScore -= 2;
    }
    
    if (unfriendlyElements.length === 0) {
      strengths.push("Clean, ATS-friendly formatting");
    } else {
      issues.push(`Remove ATS-unfriendly elements: ${unfriendlyElements.join(', ')}`);
    }
    
    score += Math.max(5, atsScore);

    // Generate dynamic feedback based on actual analysis
    const finalScore = Math.min(100, score);
    
    if (finalScore >= 85) {
      feedback = `Outstanding structure and formatting (${finalScore}/100). ${strengths.slice(0, 2).join('. ')}.`;
    } else if (finalScore >= 70) {
      feedback = `Good structure with room for improvement (${finalScore}/100). Strengths: ${strengths.slice(0, 2).join(', ')}. Focus on: ${issues.slice(0, 1).join('')}.`;
    } else if (finalScore >= 50) {
      feedback = `Adequate structure but needs enhancement (${finalScore}/100). Key issues: ${issues.slice(0, 2).join(', ')}.`;
    } else {
      feedback = `Structure requires significant improvement (${finalScore}/100). Priority fixes: ${issues.slice(0, 3).join(', ')}.`;
    }

    return { score: finalScore, feedback, issues, strengths };
  }

  /**
   * Content Quality Analysis - Expert Recruiter Perspective
   */
  analyzeContentQuality(text, structuredInfo, jobLevel) {
    let score = 0;
    let feedback = "";
    const issues = [];
    const strengths = [];

    // 1. Professional Summary Analysis (content-specific)
    const textLower = text.toLowerCase();
    const summaryKeywords = ['summary', 'objective', 'profile', 'professional summary'];
    const hasSummary = summaryKeywords.some(keyword => textLower.includes(keyword));
    
    if (hasSummary) {
      // Analyze summary quality
      const summarySection = text.substring(0, 300);
      const summaryWords = summarySection.split(/\s+/).length;
      
      if (summaryWords >= 20 && summaryWords <= 60) {
        score += 25;
        strengths.push("Well-crafted professional summary with appropriate length");
      } else if (summaryWords >= 10) {
        score += 18;
        strengths.push("Has professional summary but could be optimized");
      } else {
        score += 12;
        issues.push("Professional summary is too brief - expand to 20-50 words");
      }
    } else {
      score += 5;
      issues.push("Missing professional summary - add a compelling 2-3 line overview highlighting your value");
    }

    // 2. Action Verbs and Impact Analysis (dynamic counting)
    const strongActionVerbs = [
      'achieved', 'improved', 'increased', 'developed', 'led', 'managed', 'created',
      'implemented', 'optimized', 'designed', 'built', 'launched', 'delivered',
      'streamlined', 'transformed', 'accelerated', 'enhanced', 'pioneered', 'executed'
    ];
    
    const weakVerbs = ['responsible for', 'worked on', 'helped with', 'assisted', 'participated'];
    
    const strongVerbCount = strongActionVerbs.filter(verb => textLower.includes(verb)).length;
    const weakVerbCount = weakVerbs.filter(verb => textLower.includes(verb)).length;
    
    if (strongVerbCount >= 6) {
      score += 25;
      strengths.push(`Excellent use of ${strongVerbCount} strong action verbs demonstrating impact`);
    } else if (strongVerbCount >= 3) {
      score += 18;
      strengths.push(`Good use of action verbs (${strongVerbCount} found)`);
    } else {
      score += 8;
      issues.push(`Only ${strongVerbCount} strong action verbs found - use more impactful language`);
    }
    
    if (weakVerbCount > 2) {
      score -= 5;
      issues.push(`Replace passive phrases like "responsible for" with action verbs`);
    }

    // 3. Quantifiable Results Analysis (sophisticated pattern matching)
    const quantifierPatterns = [
      /\d+%/g,                    // percentages
      /\$[\d,]+/g,               // dollar amounts
      /\d+[kKmMbB]/g,            // large numbers (10k, 5M, etc.)
      /\d+\s*(users?|clients?|customers?|team|people)/gi,
      /\d+\s*(years?|months?|days?)/gi,
      /\d+\s*(projects?|applications?|systems?)/gi,
      /(increased?|improved?|reduced?|decreased?)\s+.*?\s+by\s+\d+/gi,
      /\d+x\s+(faster|better|more)/gi
    ];
    
    let totalQuantifiers = 0;
    const foundMetrics = [];
    
    quantifierPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      totalQuantifiers += matches.length;
      foundMetrics.push(...matches);
    });
    
    if (totalQuantifiers >= 5) {
      score += 25;
      strengths.push(`Outstanding quantification with ${totalQuantifiers} measurable achievements`);
    } else if (totalQuantifiers >= 3) {
      score += 20;
      strengths.push(`Good use of metrics (${totalQuantifiers} quantifiable results)`);
    } else if (totalQuantifiers >= 1) {
      score += 12;
      issues.push(`Only ${totalQuantifiers} quantifiable result(s) - add more specific numbers and percentages`);
    } else {
      score += 5;
      issues.push("No quantifiable achievements found - include specific metrics (%, $, team size, time saved)");
    }

    // 4. Technical Skills Analysis (dynamic and relevant)
    const techCategories = {
      languages: ['javascript', 'python', 'java', 'c++', 'typescript', 'go', 'rust', 'swift'],
      frameworks: ['react', 'angular', 'vue', 'django', 'flask', 'spring', 'express', 'laravel'],
      databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'oracle'],
      cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins'],
      tools: ['git', 'jira', 'figma', 'photoshop', 'tableau', 'power bi', 'slack']
    };
    
    let totalTechSkills = 0;
    const skillsByCategory = {};
    
    Object.entries(techCategories).forEach(([category, skills]) => {
      const foundSkills = skills.filter(skill => textLower.includes(skill));
      skillsByCategory[category] = foundSkills;
      totalTechSkills += foundSkills.length;
    });
    
    if (totalTechSkills >= 8) {
      score += 20;
      strengths.push(`Comprehensive technical skillset (${totalTechSkills} relevant technologies)`);
    } else if (totalTechSkills >= 5) {
      score += 15;
      strengths.push(`Good technical skills coverage (${totalTechSkills} technologies)`);
    } else if (totalTechSkills >= 3) {
      score += 10;
      issues.push(`Limited technical skills shown (${totalTechSkills}) - expand with relevant technologies`);
    } else {
      score += 5;
      issues.push("Very few technical skills listed - add specific technologies and tools");
    }

    // 5. Experience Depth Analysis (content-based)
    const experienceLines = structuredInfo.experience || [];
    const experienceText = text.match(/experience[\s\S]*?(?=education|skills|$)/i)?.[0] || '';
    const jobTitles = text.match(/(engineer|developer|manager|analyst|consultant|specialist|lead|senior|junior)/gi) || [];
    
    let experienceScore = 5;
    
    if (experienceLines.length >= 3 || experienceText.length > 200) {
      experienceScore += 10;
      strengths.push("Detailed work experience with comprehensive descriptions");
    } else if (experienceLines.length >= 1 || experienceText.length > 100) {
      experienceScore += 6;
    } else {
      issues.push("Work experience section needs more detailed descriptions");
    }
    
    if (jobTitles.length >= 2) {
      experienceScore += 3;
      strengths.push("Clear job progression and relevant titles");
    }
    
    score += experienceScore;

    // Generate dynamic, personalized feedback
    const finalScore = Math.min(100, score);
    
    if (finalScore >= 85) {
      feedback = `Exceptional content quality (${finalScore}/100). ${strengths.slice(0, 2).join('. ')}. Minor tweaks could make this perfect.`;
    } else if (finalScore >= 70) {
      feedback = `Strong content foundation (${finalScore}/100). Key strengths: ${strengths.slice(0, 2).join(', ')}. Consider: ${issues.slice(0, 1).join('')}.`;
    } else if (finalScore >= 50) {
      feedback = `Content needs improvement (${finalScore}/100). Priority areas: ${issues.slice(0, 2).join(', ')}.`;
    } else {
      feedback = `Content requires major overhaul (${finalScore}/100). Critical fixes needed: ${issues.slice(0, 3).join(', ')}.`;
    }

    return { score: finalScore, feedback, issues, strengths };
  }

  /**
   * ATS Optimization Analysis - Expert Recruiter Perspective
   */
  async analyzeATSOptimization(text, industry, level) {
    let score = 0;
    let feedback = "";
    const issues = [];
    const strengths = [];

    try {
      // 1. Industry Keywords Analysis
      const keywordData = await this.getIndustryKeywords(industry);
      const textLower = text.toLowerCase();
      const foundKeywords = keywordData.keywords.filter(keyword => 
        textLower.includes(keyword.toLowerCase())
      );

      if (foundKeywords.length >= 8) {
        score += 30;
        strengths.push(`Strong keyword optimization with ${foundKeywords.length} relevant terms`);
      } else if (foundKeywords.length >= 5) {
        score += 20;
        issues.push("Include more industry-specific keywords to improve ATS ranking");
      } else {
        score += 10;
        issues.push("Significantly increase relevant keywords for better ATS compatibility");
      }

      // 2. Standard Section Headers
      const standardHeaders = ['experience', 'education', 'skills', 'projects', 'summary'];
      const foundHeaders = standardHeaders.filter(header => 
        textLower.includes(header)
      ).length;

      if (foundHeaders >= 4) {
        score += 25;
        strengths.push("Uses standard section headers that ATS systems recognize");
      } else {
        score += 12;
        issues.push("Use standard section headers (Experience, Skills, Education) for ATS compatibility");
      }

      // 3. File Format Compatibility
      score += 20; // Assuming text format is ATS-friendly
      strengths.push("Text-based format is ATS-compatible");

      // 4. Keyword Density Analysis
      const keywordDensity = (foundKeywords.length / text.split(/\s+/).length) * 100;
      
      if (keywordDensity >= 2 && keywordDensity <= 5) {
        score += 15;
        strengths.push("Appropriate keyword density for ATS systems");
      } else if (keywordDensity > 5) {
        score += 8;
        issues.push("Keyword density may be too high - avoid keyword stuffing");
      } else {
        score += 10;
        issues.push("Increase relevant keyword density for better ATS scoring");
      }

      // 5. Contact Information Format
      const hasProperContact = textLower.includes('@') && 
                              (textLower.includes('phone') || /\d{10}/.test(text));
      
      if (hasProperContact) {
        score += 10;
      } else {
        score += 5;
        issues.push("Ensure contact information is clearly formatted");
      }

    } catch (error) {
      score = 50;
      issues.push("Unable to analyze keywords - ensure proper formatting");
    }

    // Generate feedback
    if (score >= 80) {
      feedback = `Excellent ATS optimization. ${strengths.join('. ')}.`;
    } else if (score >= 60) {
      feedback = `Good ATS compatibility with improvements needed: ${issues.slice(0, 2).join(', ')}.`;
    } else {
      feedback = `Poor ATS optimization. Critical issues: ${issues.join(', ')}.`;
    }

    return { score, feedback, issues, strengths };
  }

  /**
   * Relevance Analysis - Expert Recruiter Perspective
   */
  analyzeRelevance(text, structuredInfo, industry, level) {
    let score = 0;
    let feedback = "";
    const issues = [];
    const strengths = [];

    // 1. Role-Level Appropriateness
    const seniorKeywords = ['lead', 'senior', 'architect', 'manager', 'director', 'strategy'];
    const midKeywords = ['developer', 'engineer', 'analyst', 'specialist', 'coordinator'];
    const entryKeywords = ['junior', 'associate', 'intern', 'trainee', 'assistant'];

    const textLower = text.toLowerCase();
    
    if (level === 'senior') {
      const seniorTerms = seniorKeywords.filter(term => textLower.includes(term)).length;
      if (seniorTerms >= 2) {
        score += 25;
        strengths.push("Experience level matches senior role expectations");
      } else {
        score += 15;
        issues.push("Include more leadership and strategic responsibilities for senior roles");
      }
    } else if (level === 'mid') {
      const midTerms = midKeywords.filter(term => textLower.includes(term)).length;
      if (midTerms >= 2) {
        score += 25;
        strengths.push("Experience aligns well with mid-level positions");
      } else {
        score += 15;
        issues.push("Highlight technical expertise and project ownership for mid-level roles");
      }
    } else {
      const entryTerms = entryKeywords.filter(term => textLower.includes(term)).length;
      if (entryTerms >= 1 || textLower.includes('graduate') || textLower.includes('fresh')) {
        score += 25;
        strengths.push("Appropriately positioned for entry-level opportunities");
      } else {
        score += 20;
      }
    }

    // 2. Industry Relevance
    const industryTerms = {
      technology: ['software', 'programming', 'development', 'coding', 'tech', 'digital'],
      healthcare: ['medical', 'patient', 'clinical', 'healthcare', 'hospital'],
      finance: ['financial', 'banking', 'investment', 'accounting', 'risk'],
      marketing: ['marketing', 'campaign', 'brand', 'social media', 'analytics']
    };

    const relevantTerms = industryTerms[industry] || industryTerms.technology;
    const foundIndustryTerms = relevantTerms.filter(term => textLower.includes(term)).length;

    if (foundIndustryTerms >= 3) {
      score += 25;
      strengths.push(`Strong alignment with ${industry} industry requirements`);
    } else if (foundIndustryTerms >= 1) {
      score += 15;
      issues.push(`Include more ${industry}-specific terminology and experience`);
    } else {
      score += 8;
      issues.push(`Resume lacks industry-specific content for ${industry} roles`);
    }

    // 3. Skills Currency
    const modernSkills = ['cloud', 'ai', 'machine learning', 'automation', 'devops', 'agile'];
    const modernSkillCount = modernSkills.filter(skill => textLower.includes(skill)).length;

    if (modernSkillCount >= 2) {
      score += 20;
      strengths.push("Includes modern, in-demand skills");
    } else {
      score += 10;
      issues.push("Consider adding current industry trends and technologies");
    }

    // 4. Achievement Focus
    const achievements = text.match(/(improved|increased|reduced|achieved|delivered|launched)/gi) || [];
    
    if (achievements.length >= 4) {
      score += 20;
      strengths.push("Strong focus on achievements and results");
    } else {
      score += 10;
      issues.push("Emphasize accomplishments rather than just responsibilities");
    }

    // 5. Professional Growth
    const growthIndicators = ['promoted', 'advanced', 'recognized', 'awarded', 'certified'];
    const growthCount = growthIndicators.filter(indicator => textLower.includes(indicator)).length;

    if (growthCount >= 1) {
      score += 10;
      strengths.push("Shows professional growth and recognition");
    } else {
      score += 5;
      issues.push("Highlight career progression and professional development");
    }

    // Generate feedback
    if (score >= 80) {
      feedback = `Highly relevant for target roles. ${strengths.join('. ')}.`;
    } else if (score >= 60) {
      feedback = `Good relevance with opportunities to improve: ${issues.slice(0, 2).join(', ')}.`;
    } else {
      feedback = `Limited relevance for target roles. Focus on: ${issues.slice(0, 3).join(', ')}.`;
    }

    return { score, feedback, issues, strengths };
  }

  /**
   * Generate Expert Review - Technical Recruiter Perspective
   */
  generateExpertReview(analysis, text, structuredInfo) {
    const review = {
      summary: "",
      topStrengths: [],
      topWeaknesses: [],
      actionableImprovements: [],
      rewrittenBullets: []
    };

    // Calculate average score for dynamic summary
    const avgScore = Math.round(
      (analysis.scores.structureFormatting + 
       analysis.scores.contentQuality + 
       analysis.scores.atsOptimization + 
       analysis.scores.overallImpact) / 4
    );

    // Generate context-aware summary based on actual content analysis
    const wordCount = text.split(/\s+/).length;
    const hasQuantifiableResults = /\d+%|\$[\d,]+|\d+[kKmMbB]/g.test(text);
    const hasActionVerbs = /(achieved|improved|increased|developed|led|managed|created|implemented)/i.test(text);
    const hasTechnicalSkills = /(javascript|python|react|aws|sql|git)/i.test(text.toLowerCase());
    
    if (avgScore >= 85) {
      review.summary = `This is an exceptional resume that effectively showcases your technical expertise and achievements. ${hasQuantifiableResults ? 'The quantifiable results demonstrate clear impact,' : ''} and the professional presentation will resonate well with hiring managers. Minor optimizations could make this perfect for senior-level positions.`;
    } else if (avgScore >= 70) {
      review.summary = `This resume has a solid foundation with ${hasActionVerbs ? 'good use of action verbs' : 'room for stronger language'} and ${hasTechnicalSkills ? 'relevant technical skills' : 'technical content that could be expanded'}. ${hasQuantifiableResults ? 'The metrics are helpful but could be expanded.' : 'Adding more quantifiable achievements would significantly strengthen your impact.'} With focused improvements, this could compete effectively in the current market.`;
    } else if (avgScore >= 50) {
      review.summary = `This resume requires targeted improvements to meet current industry standards. ${!hasQuantifiableResults ? 'The lack of specific metrics is a major weakness - ' : ''}${!hasActionVerbs ? 'passive language reduces impact, and ' : ''}the presentation needs enhancement to effectively showcase your capabilities. Focus on quantifying achievements and strengthening technical content.`;
    } else {
      review.summary = `This resume needs comprehensive restructuring to be competitive in today's market. ${wordCount < 300 ? 'It\'s too brief and lacks essential detail.' : 'The content structure needs significant improvement.'} Priority should be on adding quantifiable achievements, improving professional presentation, and aligning content with target role requirements.`;
    }

    // Dynamic strengths based on actual analysis
    const allStrengths = [];
    
    if (analysis.scores.structureFormatting >= 75) {
      allStrengths.push("Excellent resume structure and professional formatting that enhances readability");
    } else if (analysis.scores.structureFormatting >= 60) {
      allStrengths.push("Good overall structure with clear section organization");
    }
    
    if (analysis.scores.contentQuality >= 75) {
      allStrengths.push("Strong content quality with impactful language and relevant details");
    } else if (analysis.scores.contentQuality >= 60) {
      allStrengths.push("Solid content foundation with room for enhancement");
    }
    
    if (analysis.scores.atsOptimization >= 75) {
      allStrengths.push("Well-optimized for ATS systems with relevant keywords and proper formatting");
    } else if (analysis.scores.atsOptimization >= 60) {
      allStrengths.push("Good ATS compatibility with minor optimization opportunities");
    }

    // Content-specific strengths
    if (hasQuantifiableResults) {
      allStrengths.push("Includes quantifiable achievements that demonstrate measurable impact");
    }
    if (hasActionVerbs) {
      allStrengths.push("Uses strong action verbs that convey leadership and initiative");
    }
    if (hasTechnicalSkills) {
      allStrengths.push("Showcases relevant technical skills aligned with industry demands");
    }
    if (wordCount >= 300 && wordCount <= 600) {
      allStrengths.push("Maintains optimal length for comprehensive yet concise presentation");
    }

    review.topStrengths = allStrengths.slice(0, 3);
    if (review.topStrengths.length === 0) {
      review.topStrengths = ["Resume submitted for analysis", "Shows initiative in seeking feedback", "Has basic contact information"];
    }

    // Dynamic weaknesses based on analysis gaps
    const allWeaknesses = [];
    
    if (analysis.scores.structureFormatting < 60) {
      allWeaknesses.push("Resume structure and formatting need significant improvement for professional presentation");
    }
    if (analysis.scores.contentQuality < 60) {
      allWeaknesses.push("Content lacks impact and needs stronger action verbs with quantifiable achievements");
    }
    if (analysis.scores.atsOptimization < 60) {
      allWeaknesses.push("Poor ATS optimization - missing industry keywords and proper formatting standards");
    }

    // Content-specific weaknesses
    if (!hasQuantifiableResults) {
      allWeaknesses.push("Lacks specific metrics and quantifiable achievements that demonstrate value and impact");
    }
    if (!hasActionVerbs) {
      allWeaknesses.push("Uses passive language instead of strong action verbs that convey leadership and results");
    }
    if (!text.toLowerCase().includes('summary') && !text.toLowerCase().includes('objective')) {
      allWeaknesses.push("Missing professional summary that would immediately communicate value proposition");
    }
    if (wordCount < 300) {
      allWeaknesses.push("Resume too brief - needs more detailed descriptions of achievements and responsibilities");
    }
    if (!hasTechnicalSkills) {
      allWeaknesses.push("Limited technical skills presentation - needs specific technologies and tools relevant to target roles");
    }

    review.topWeaknesses = allWeaknesses.slice(0, 3);

    // Dynamic improvements based on specific deficiencies
    const improvements = [];
    
    if (!text.toLowerCase().includes('summary')) {
      improvements.push("**Add Professional Summary**: Create a compelling 2-3 line summary highlighting your unique value proposition, key skills, and target role aspirations");
    }
    
    if (!hasQuantifiableResults) {
      improvements.push("**Quantify All Achievements**: Replace generic statements with specific metrics - include percentages, dollar amounts, team sizes, timeframes, and measurable outcomes");
    }
    
    if (!hasActionVerbs) {
      improvements.push("**Strengthen Action Verbs**: Begin each bullet point with powerful action verbs like 'achieved,' 'implemented,' 'optimized,' 'led,' or 'delivered' instead of passive phrases");
    }
    
    if (!hasTechnicalSkills) {
      improvements.push("**Expand Technical Skills**: Add a comprehensive skills section organized by category (Languages, Frameworks, Tools, Cloud Platforms) with current, relevant technologies");
    }
    
    improvements.push("**Optimize for ATS**: Include industry-specific keywords from job descriptions and use standard section headers like 'Professional Experience' and 'Technical Skills'");
    improvements.push("**Add Project Portfolio**: Include 2-3 key projects with technologies used, your role, and measurable outcomes to demonstrate practical application of skills");

    review.actionableImprovements = improvements.slice(0, 6);

    // Generate realistic sample rewrites based on content analysis
    const sampleBullets = [];
    
    if (text.toLowerCase().includes('responsible for') || text.toLowerCase().includes('worked on')) {
      sampleBullets.push({
        before: "Responsible for developing web applications",
        after: "Developed 5+ responsive web applications using React and Node.js, serving 10,000+ active users with 99.9% uptime"
      });
    }
    
    if (!hasQuantifiableResults) {
      sampleBullets.push({
        before: "Improved system performance",
        after: "Optimized database queries and caching strategies, reducing page load times by 60% and improving user satisfaction scores from 3.2 to 4.7/5"
      });
    }
    
    if (text.toLowerCase().includes('team') && !hasActionVerbs) {
      sampleBullets.push({
        before: "Worked with development team on projects",
        after: "Led cross-functional team of 6 developers and designers, delivering 12 product features ahead of schedule and reducing bug reports by 40%"
      });
    }

    review.rewrittenBullets = sampleBullets;

    return review;
  }
  async analyzeKeywords(text, industry, level) {
    try {
      const keywordData = await this.getIndustryKeywords(industry);
      const textLower = text.toLowerCase();
      const words = textLower.split(/\s+/);
      const totalWords = words.length;

      const foundKeywords = [];
      const missingKeywords = [];
      const keywordFrequency = {};

      // Analyze keyword presence and frequency
      keywordData.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        const occurrences = (textLower.match(new RegExp(keywordLower, 'g')) || []).length;
        
        if (occurrences > 0) {
          foundKeywords.push({
            keyword: keyword,
            frequency: occurrences,
            density: (occurrences / totalWords * 100).toFixed(2)
          });
          keywordFrequency[keyword] = occurrences;
        } else {
          missingKeywords.push(keyword);
        }
      });

      // Calculate keyword score based on multiple factors
      const keywordScore = this.calculateKeywordScore(foundKeywords, keywordData.keywords, level);
      
      // Generate keyword suggestions
      const suggestions = this.generateKeywordSuggestions(missingKeywords, level);

      return {
        score: keywordScore,
        keywords: {
          found: foundKeywords,
          missing: missingKeywords.slice(0, 10), // Top 10 missing keywords
          suggestions: suggestions,
          density: foundKeywords.length > 0 ? 
            (foundKeywords.reduce((sum, kw) => sum + parseFloat(kw.density), 0) / foundKeywords.length).toFixed(2) : 0,
          relevantCount: foundKeywords.length
        },
        details: {
          totalKeywordsAnalyzed: keywordData.keywords.length,
          keywordsFound: foundKeywords.length,
          keywordCoverage: ((foundKeywords.length / keywordData.keywords.length) * 100).toFixed(1),
          industryRelevance: this.calculateIndustryRelevance(foundKeywords, industry),
          levelAppropriate: this.checkLevelAppropriateness(foundKeywords, level)
        }
      };

    } catch (error) {
      console.error('Keyword analysis error:', error);
      return {
        score: 50,
        keywords: { found: [], missing: [], suggestions: [], density: 0, relevantCount: 0 },
        details: { error: 'Keyword analysis failed' }
      };
    }
  }

  /**
   * Enhanced formatting analysis
   */
  analyzeFormatting(text, structuredInfo) {
    const formatScore = { total: 0, max: 0 };
    const issues = [];
    const strengths = [];

    // 1. Check for ATS-friendly sections (20 points)
    const requiredSections = ['experience', 'education', 'skills'];
    const foundSections = structuredInfo.sections?.map(s => s.type) || [];
    const sectionScore = (foundSections.filter(s => requiredSections.includes(s)).length / requiredSections.length) * 20;
    formatScore.total += sectionScore;
    formatScore.max += 20;

    if (sectionScore >= 15) {
      strengths.push('Well-organized section structure');
    } else {
      issues.push('Missing essential sections (Experience, Education, Skills)');
    }

    // 2. Check formatting consistency (15 points)
    const consistencyScore = this.checkFormattingConsistency(text);
    formatScore.total += consistencyScore;
    formatScore.max += 15;

    if (consistencyScore >= 12) {
      strengths.push('Consistent formatting throughout');
    } else {
      issues.push('Inconsistent formatting detected');
    }

    // 3. Check for ATS-unfriendly elements (15 points)
    const unfriendlyElements = this.detectUnfriendlyElements(text);
    const unfriendlyScore = Math.max(0, 15 - (unfriendlyElements.length * 3));
    formatScore.total += unfriendlyScore;
    formatScore.max += 15;

    if (unfriendlyElements.length === 0) {
      strengths.push('No ATS-unfriendly formatting detected');
    } else {
      issues.push(`ATS-unfriendly elements found: ${unfriendlyElements.join(', ')}`);
    }

    // 4. Check text readability (10 points)
    const readabilityScore = this.calculateReadabilityScore(text);
    formatScore.total += readabilityScore;
    formatScore.max += 10;

    if (readabilityScore >= 8) {
      strengths.push('Good text readability and structure');
    } else {
      issues.push('Text readability could be improved');
    }

    const finalScore = Math.round((formatScore.total / formatScore.max) * 100);

    return {
      score: finalScore,
      details: {
        sectionStructure: Math.round(sectionScore),
        formattingConsistency: Math.round(consistencyScore),
        atsCompatibility: Math.round(unfriendlyScore),
        readability: Math.round(readabilityScore),
        issues: issues,
        strengths: strengths,
        recommendations: this.generateFormattingRecommendations(issues)
      }
    };
  }

  /**
   * Enhanced content analysis
   */
  analyzeContent(text, structuredInfo) {
    const contentScore = { total: 0, max: 0 };
    const issues = [];
    const strengths = [];

    // 1. Resume length analysis (15 points)
    const wordCount = text.split(/\s+/).length;
    const lengthScore = this.scoreLengthAppropriate(wordCount);
    contentScore.total += lengthScore;
    contentScore.max += 15;

    if (lengthScore >= 12) {
      strengths.push('Appropriate resume length');
    } else {
      issues.push(wordCount < 300 ? 'Resume too short' : 'Resume too long');
    }

    // 2. Contact information completeness (10 points)
    const contactScore = this.scoreContactInfo(structuredInfo);
    contentScore.total += contactScore;
    contentScore.max += 10;

    if (contactScore >= 8) {
      strengths.push('Complete contact information');
    } else {
      issues.push('Missing or incomplete contact information');
    }

    // 3. Professional summary/objective (10 points)
    const summaryScore = this.scoreProfessionalSummary(text);
    contentScore.total += summaryScore;
    contentScore.max += 10;

    if (summaryScore >= 8) {
      strengths.push('Strong professional summary');
    } else {
      issues.push('Missing or weak professional summary');
    }

    // 4. Work experience quality (20 points)
    const experienceScore = this.scoreWorkExperience(text, structuredInfo);
    contentScore.total += experienceScore;
    contentScore.max += 20;

    if (experienceScore >= 16) {
      strengths.push('Well-detailed work experience');
    } else {
      issues.push('Work experience needs more detail');
    }

    // 5. Skills relevance (15 points)
    const skillsScore = this.scoreSkillsSection(structuredInfo);
    contentScore.total += skillsScore;
    contentScore.max += 15;

    if (skillsScore >= 12) {
      strengths.push('Comprehensive skills section');
    } else {
      issues.push('Skills section needs enhancement');
    }

    // 6. Education information (10 points)
    const educationScore = this.scoreEducation(structuredInfo);
    contentScore.total += educationScore;
    contentScore.max += 10;

    if (educationScore >= 8) {
      strengths.push('Complete education information');
    } else {
      issues.push('Education section needs improvement');
    }

    // 7. Achievements and quantifiable results (20 points)
    const achievementScore = this.scoreAchievements(text);
    contentScore.total += achievementScore;
    contentScore.max += 20;

    if (achievementScore >= 16) {
      strengths.push('Strong quantifiable achievements');
    } else {
      issues.push('Add more quantifiable achievements');
    }

    const finalScore = Math.round((contentScore.total / contentScore.max) * 100);

    return {
      score: finalScore,
      details: {
        wordCount: wordCount,
        lengthScore: Math.round(lengthScore),
        contactScore: Math.round(contactScore),
        summaryScore: Math.round(summaryScore),
        experienceScore: Math.round(experienceScore),
        skillsScore: Math.round(skillsScore),
        educationScore: Math.round(educationScore),
        achievementScore: Math.round(achievementScore),
        issues: issues,
        strengths: strengths,
        recommendations: this.generateContentRecommendations(issues)
      }
    };
  }

  /**
   * Enhanced structure analysis
   */
  analyzeStructure(text, structuredInfo) {
    const structureScore = { total: 0, max: 0 };
    const issues = [];
    const strengths = [];

    // 1. Section order analysis (25 points)
    const orderScore = this.scoreSectionOrder(structuredInfo.sections);
    structureScore.total += orderScore;
    structureScore.max += 25;

    if (orderScore >= 20) {
      strengths.push('Logical section organization');
    } else {
      issues.push('Section order could be improved');
    }

    // 2. Section completeness (25 points)
    const completenessScore = this.scoreSectionCompleteness(structuredInfo.sections);
    structureScore.total += completenessScore;
    structureScore.max += 25;

    if (completenessScore >= 20) {
      strengths.push('All essential sections present');
    } else {
      issues.push('Missing important sections');
    }

    // 3. Information hierarchy (25 points)
    const hierarchyScore = this.scoreInformationHierarchy(text);
    structureScore.total += hierarchyScore;
    structureScore.max += 25;

    if (hierarchyScore >= 20) {
      strengths.push('Clear information hierarchy');
    } else {
      issues.push('Information hierarchy needs improvement');
    }

    // 4. Content flow and readability (25 points)
    const flowScore = this.scoreContentFlow(text);
    structureScore.total += flowScore;
    structureScore.max += 25;

    if (flowScore >= 20) {
      strengths.push('Excellent content flow');
    } else {
      issues.push('Content flow could be smoother');
    }

    const finalScore = Math.round((structureScore.total / structureScore.max) * 100);

    return {
      score: finalScore,
      details: {
        sectionOrder: Math.round(orderScore),
        completeness: Math.round(completenessScore),
        hierarchy: Math.round(hierarchyScore),
        contentFlow: Math.round(flowScore),
        issues: issues,
        strengths: strengths,
        recommendations: this.generateStructureRecommendations(issues)
      }
    };
  }

  /**
   * Calculate overall score with weighted categories
   */
  calculateOverallScore(categoryScores) {
    const weightedScore = 
      (categoryScores.keywords * this.weights.keywords) +
      (categoryScores.formatting * this.weights.formatting) +
      (categoryScores.content * this.weights.content) +
      (categoryScores.structure * this.weights.structure);

    return Math.round(weightedScore);
  }

  /**
   * Calculate letter grade based on score
   */
  calculateGrade(score) {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'A-';
    if (score >= 75) return 'B+';
    if (score >= 70) return 'B';
    if (score >= 65) return 'B-';
    if (score >= 60) return 'C+';
    if (score >= 55) return 'C';
    if (score >= 50) return 'C-';
    if (score >= 45) return 'D+';
    if (score >= 40) return 'D';
    return 'F';
  }

  /**
   * Helper methods for detailed scoring
   */
  calculateKeywordScore(foundKeywords, totalKeywords, level) {
    if (foundKeywords.length === 0) return 25;
    
    const coverage = foundKeywords.length / totalKeywords;
    const averageDensity = foundKeywords.reduce((sum, kw) => sum + parseFloat(kw.density), 0) / foundKeywords.length;
    
    let baseScore = Math.min(90, coverage * 100);
    
    // Adjust for appropriate keyword density
    if (averageDensity >= 1.5 && averageDensity <= 3.0) {
      baseScore += 5; // Bonus for good density
    } else if (averageDensity > 3.0) {
      baseScore -= 10; // Penalty for keyword stuffing
    }
    
    // Level-based adjustments
    if (level === 'senior' && foundKeywords.length >= 15) {
      baseScore += 5;
    } else if (level === 'entry' && foundKeywords.length >= 8) {
      baseScore += 5;
    }
    
    return Math.max(20, Math.min(95, baseScore));
  }

  checkFormattingConsistency(text) {
    let score = 15;
    const lines = text.split('\n');
    
    // Check for consistent bullet points
    const bulletTypes = [];
    lines.forEach(line => {
      if (line.trim().match(/^[•▪▫◦‣⁃]/)) bulletTypes.push('bullet');
      if (line.trim().match(/^[-*]/)) bulletTypes.push('dash');
      if (line.trim().match(/^\d+\./)) bulletTypes.push('number');
    });
    
    if (new Set(bulletTypes).size > 2) score -= 3;
    
    return Math.max(0, score);
  }

  detectUnfriendlyElements(text) {
    const unfriendlyElements = [];
    
    if (text.includes('|')) unfriendlyElements.push('pipe characters');
    if (text.match(/[^\x00-\x7F]/g)) unfriendlyElements.push('special characters');
    if (text.includes('\t')) unfriendlyElements.push('tab characters');
    
    return unfriendlyElements;
  }

  calculateReadabilityScore(text) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const avgWordsPerSentence = words.length / sentences.length;
    
    // Optimal range: 15-20 words per sentence
    if (avgWordsPerSentence >= 15 && avgWordsPerSentence <= 20) {
      return 10;
    } else if (avgWordsPerSentence >= 12 && avgWordsPerSentence <= 25) {
      return 8;
    } else {
      return 6;
    }
  }

  scoreLengthAppropriate(wordCount) {
    if (wordCount >= 400 && wordCount <= 800) return 15;
    if (wordCount >= 300 && wordCount <= 1000) return 12;
    if (wordCount >= 200 && wordCount <= 1200) return 8;
    return 5;
  }

  scoreContactInfo(structuredInfo) {
    let score = 0;
    if (structuredInfo.email) score += 4;
    if (structuredInfo.phone) score += 3;
    if (structuredInfo.text && structuredInfo.text.toLowerCase().includes('linkedin')) score += 3;
    return Math.min(10, score);
  }

  scoreProfessionalSummary(text) {
    const summaryKeywords = ['summary', 'objective', 'profile', 'professional summary'];
    const hasSummary = summaryKeywords.some(keyword => 
      text.toLowerCase().includes(keyword)
    );
    
    if (hasSummary) {
      const summaryLength = text.substring(0, 500).split(/\s+/).length;
      if (summaryLength >= 30 && summaryLength <= 80) return 10;
      if (summaryLength >= 20 && summaryLength <= 100) return 8;
      return 6;
    }
    return 3;
  }

  scoreWorkExperience(text, structuredInfo) {
    const experienceLines = structuredInfo.experience || [];
    if (experienceLines.length === 0) return 5;
    
    let score = 10; // Base score for having experience
    
    // Check for quantifiable achievements
    const quantifiers = /\d+%|\$\d+|\d+\+|\d+ years?|\d+ months?/gi;
    const quantifiableLines = experienceLines.filter(line => quantifiers.test(line));
    score += Math.min(10, quantifiableLines.length * 2);
    
    return Math.min(20, score);
  }

  scoreSkillsSection(structuredInfo) {
    const skills = structuredInfo.skills || [];
    if (skills.length === 0) return 3;
    
    if (skills.length >= 10) return 15;
    if (skills.length >= 6) return 12;
    if (skills.length >= 3) return 8;
    return 5;
  }

  scoreEducation(structuredInfo) {
    const education = structuredInfo.education || [];
    if (education.length === 0) return 3;
    
    const hasDegreeLine = education.some(line => 
      /bachelor|master|phd|degree|university|college/i.test(line)
    );
    
    return hasDegreeLine ? 10 : 6;
  }

  scoreAchievements(text) {
    // Look for quantifiable achievements
    const achievementPatterns = [
      /increased?\s+.*?\s+by\s+\d+%/gi,
      /reduced?\s+.*?\s+by\s+\d+%/gi,
      /improved?\s+.*?\s+by\s+\d+%/gi,
      /\$\d+[kmb]?/gi,
      /\d+%\s+(increase|improvement|reduction)/gi,
      /managed?\s+.*?\s+\d+/gi,
      /led\s+.*?\s+\d+/gi
    ];
    
    let achievementCount = 0;
    achievementPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      achievementCount += matches.length;
    });
    
    return Math.min(20, achievementCount * 4);
  }

  scoreSectionOrder(sections) {
    if (!sections || sections.length === 0) return 10;
    
    const idealOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    let score = 25;
    
    // Check if critical sections appear in reasonable order
    const sectionTypes = sections.map(s => s.type);
    if (sectionTypes.indexOf('experience') > sectionTypes.indexOf('education') && 
        sectionTypes.includes('experience') && sectionTypes.includes('education')) {
      score -= 5; // Penalty for education before experience
    }
    
    return Math.max(15, score);
  }

  scoreSectionCompleteness(sections) {
    if (!sections) return 10;
    
    const requiredSections = ['experience', 'education', 'skills'];
    const optionalSections = ['summary', 'projects', 'certifications'];
    
    const sectionTypes = sections.map(s => s.type);
    const requiredCount = requiredSections.filter(req => sectionTypes.includes(req)).length;
    const optionalCount = optionalSections.filter(opt => sectionTypes.includes(opt)).length;
    
    let score = (requiredCount / requiredSections.length) * 20;
    score += Math.min(5, optionalCount * 1.5);
    
    return Math.min(25, score);
  }

  scoreInformationHierarchy(text) {
    // Check for clear headings and subheadings
    const lines = text.split('\n');
    const headingLines = lines.filter(line => {
      const trimmed = line.trim();
      return trimmed.length > 0 && 
             trimmed.length < 50 && 
             (trimmed === trimmed.toUpperCase() || 
              /^[A-Z][A-Z\s]+$/.test(trimmed));
    });
    
    const ratio = headingLines.length / lines.length;
    if (ratio >= 0.05 && ratio <= 0.15) return 25;
    if (ratio >= 0.03 && ratio <= 0.20) return 20;
    return 15;
  }

  scoreContentFlow(text) {
    // Simple flow analysis based on paragraph structure
    const paragraphs = text.split('\n\n').filter(p => p.trim().length > 0);
    const avgParagraphLength = text.length / paragraphs.length;
    
    if (avgParagraphLength >= 100 && avgParagraphLength <= 300) return 25;
    if (avgParagraphLength >= 50 && avgParagraphLength <= 400) return 20;
    return 15;
  }

  /**
   * Generate comprehensive suggestions
   */
  generateSuggestions(analysis) {
    const suggestions = [];
    
    // Keyword suggestions
    if (analysis.categoryScores.keywords < 70) {
      suggestions.push({
        category: 'Keywords',
        priority: 'High',
        suggestion: `Include more industry-relevant keywords. You're currently using ${analysis.keywords.relevantCount} relevant keywords.`,
        impact: 'High'
      });
    }
    
    // Formatting suggestions
    if (analysis.categoryScores.formatting < 70) {
      suggestions.push({
        category: 'Formatting',
        priority: 'High',
        suggestion: 'Improve resume formatting for better ATS compatibility',
        impact: 'High'
      });
    }
    
    // Content suggestions
    if (analysis.categoryScores.content < 70) {
      suggestions.push({
        category: 'Content',
        priority: 'Medium',
        suggestion: 'Add more quantifiable achievements and detailed experience descriptions',
        impact: 'Medium'
      });
    }
    
    // Structure suggestions
    if (analysis.categoryScores.structure < 70) {
      suggestions.push({
        category: 'Structure',
        priority: 'Medium',
        suggestion: 'Reorganize sections for better flow and readability',
        impact: 'Medium'
      });
    }
    
    return suggestions;
  }

  /**
   * Identify strengths
   */
  identifyStrengths(analysis) {
    const strengths = [];
    
    Object.entries(analysis.categoryScores).forEach(([category, score]) => {
      if (score >= 80) {
        strengths.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          score: score,
          description: `Excellent ${category} optimization`
        });
      }
    });
    
    return strengths;
  }

  /**
   * Identify areas for improvement
   */
  identifyImprovements(analysis) {
    const improvements = [];
    
    Object.entries(analysis.categoryScores).forEach(([category, score]) => {
      if (score < 70) {
        improvements.push({
          category: category.charAt(0).toUpperCase() + category.slice(1),
          score: score,
          priority: score < 50 ? 'High' : 'Medium',
          description: `${category} needs improvement to meet ATS standards`
        });
      }
    });
    
    return improvements;
  }

  /**
   * Assess ATS compatibility
   */
  assessATSCompatibility(analysis) {
    const compatibilityScore = analysis.overallScore;
    const issues = [];
    const strengths = [];
    const recommendations = [];
    
    if (compatibilityScore >= 80) {
      strengths.push('Excellent ATS compatibility');
      recommendations.push('Your resume is well-optimized for ATS systems');
    } else if (compatibilityScore >= 70) {
      strengths.push('Good ATS compatibility');
      recommendations.push('Minor improvements could boost your ATS performance');
    } else {
      issues.push('ATS compatibility needs improvement');
      recommendations.push('Significant changes recommended for better ATS performance');
    }
    
    return {
      score: compatibilityScore,
      issues,
      strengths,
      recommendations
    };
  }

  /**
   * Generate competitive analysis
   */
  generateCompetitiveAnalysis(score) {
    let percentile, comparison;
    
    if (score >= 85) {
      percentile = 90;
      comparison = 'Your resume outperforms 90% of resumes in our database';
    } else if (score >= 75) {
      percentile = 75;
      comparison = 'Your resume outperforms 75% of resumes in our database';
    } else if (score >= 65) {
      percentile = 60;
      comparison = 'Your resume outperforms 60% of resumes in our database';
    } else if (score >= 55) {
      percentile = 40;
      comparison = 'Your resume outperforms 40% of resumes in our database';
    } else {
      percentile = 25;
      comparison = 'Your resume needs improvement to compete effectively';
    }
    
    return { percentile, comparison };
  }

  /**
   * Add realistic variation to analysis results
   */
  addAnalysisVariation(analysis, text) {
    // Add small random variations to make results more realistic
    const variation = (Math.random() - 0.5) * 6; // ±3 points
    
    analysis.overallScore = Math.max(20, Math.min(98, analysis.overallScore + Math.round(variation)));
    analysis.grade = this.calculateGrade(analysis.overallScore);
    
    // Adjust category scores slightly
    Object.keys(analysis.categoryScores).forEach(category => {
      const categoryVariation = (Math.random() - 0.5) * 4; // ±2 points
      analysis.categoryScores[category] = Math.max(15, Math.min(95, 
        analysis.categoryScores[category] + Math.round(categoryVariation)
      ));
    });
    
    return analysis;
  }

  /**
   * Get industry-specific keywords
   */
  async getIndustryKeywords(industry) {
    try {
      let keywordDoc = await KeywordDatabase.findOne({ industry });
      
      if (!keywordDoc) {
        // Fallback to default keywords if industry not found
        keywordDoc = await KeywordDatabase.findOne({ industry: 'technology' });
      }
      
      if (!keywordDoc) {
        // Ultimate fallback
        return {
          keywords: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'API', 'Database', 'Framework', 'Development']
        };
      }
      
      return keywordDoc;
    } catch (error) {
      console.error('Error fetching keywords:', error);
      return {
        keywords: ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'Git', 'API', 'Database', 'Framework', 'Development']
      };
    }
  }

  // Additional helper methods for recommendations
  generateFormattingRecommendations(issues) {
    const recommendations = [];
    issues.forEach(issue => {
      if (issue.includes('sections')) {
        recommendations.push('Add clear section headers like "Experience", "Education", and "Skills"');
      }
      if (issue.includes('formatting')) {
        recommendations.push('Use consistent bullet points and maintain uniform spacing');
      }
      if (issue.includes('unfriendly')) {
        recommendations.push('Remove special characters, tables, and graphics that ATS cannot read');
      }
    });
    return recommendations;
  }

  generateContentRecommendations(issues) {
    const recommendations = [];
    issues.forEach(issue => {
      if (issue.includes('short')) {
        recommendations.push('Expand your resume with more detailed descriptions of your achievements');
      }
      if (issue.includes('contact')) {
        recommendations.push('Include complete contact information: email, phone, and LinkedIn profile');
      }
      if (issue.includes('summary')) {
        recommendations.push('Add a professional summary that highlights your key qualifications');
      }
      if (issue.includes('achievements')) {
        recommendations.push('Include specific, quantifiable achievements (e.g., "Increased sales by 25%")');
      }
    });
    return recommendations;
  }

  generateStructureRecommendations(issues) {
    const recommendations = [];
    issues.forEach(issue => {
      if (issue.includes('order')) {
        recommendations.push('Reorganize sections: Summary, Experience, Education, Skills');
      }
      if (issue.includes('sections')) {
        recommendations.push('Include all essential sections and remove irrelevant ones');
      }
      if (issue.includes('hierarchy')) {
        recommendations.push('Use clear headings and maintain consistent formatting hierarchy');
      }
    });
    return recommendations;
  }

  generateKeywordSuggestions(missingKeywords, level) {
    const suggestions = [];
    const topMissing = missingKeywords.slice(0, 8);
    
    topMissing.forEach(keyword => {
      suggestions.push({
        keyword,
        context: this.getKeywordContext(keyword, level),
        priority: this.getKeywordPriority(keyword)
      });
    });
    
    return suggestions;
  }

  getKeywordContext(keyword, level) {
    const contexts = {
      'JavaScript': 'Include in technical skills or project descriptions',
      'Python': 'Mention in programming languages or data analysis projects',
      'React': 'Add to frontend development experience',
      'Node.js': 'Include in backend development sections',
      'Project Management': 'Highlight in experience or skills section',
      'Leadership': 'Demonstrate through team management examples'
    };
    
    return contexts[keyword] || `Consider adding "${keyword}" to relevant sections`;
  }

  getKeywordPriority(keyword) {
    const highPriority = ['JavaScript', 'Python', 'Project Management', 'Leadership', 'Communication'];
    return highPriority.includes(keyword) ? 'High' : 'Medium';
  }

  calculateIndustryRelevance(foundKeywords, industry) {
    // Simple relevance calculation based on keyword frequency and industry
    const relevantCount = foundKeywords.filter(kw => kw.frequency >= 1).length;
    return Math.min(100, (relevantCount / 10) * 100);
  }

  checkLevelAppropriateness(foundKeywords, level) {
    const seniorKeywords = ['leadership', 'management', 'strategy', 'architect'];
    const entryKeywords = ['learning', 'training', 'support', 'assist'];
    
    const keywordText = foundKeywords.map(kw => kw.keyword.toLowerCase()).join(' ');
    
    if (level === 'senior') {
      return seniorKeywords.some(keyword => keywordText.includes(keyword));
    } else if (level === 'entry') {
      return entryKeywords.some(keyword => keywordText.includes(keyword));
    }
    
    return true;
  }
}

export default ATSAnalysisEngine;
