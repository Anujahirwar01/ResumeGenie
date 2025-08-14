import { KeywordDatabase } from '../models/index.js';

class ATSAnalysisEngine {
  constructor() {
    this.weights = {
      keywords: 0.30,        // 30% - Keyword relevance
      formatting: 0.25,     // 25% - ATS-friendly formatting
      content: 0.25,        // 25% - Content quality and completeness
      structure: 0.20       // 20% - Resume structure and organization
    };

    this.passingScore = 70; // Minimum score to be considered ATS-friendly
  }

  /**
   * Main analysis function - analyzes resume and returns comprehensive score
   */
  async analyzeResume(extractedText, structuredInfo, jobIndustry = 'technology', jobLevel = 'mid') {
    try {
      const analysis = {
        overallScore: 0,
        categoryScores: {},
        details: {},
        suggestions: [],
        keywords: {
          found: [],
          missing: [],
          suggestions: []
        },
        atsCompatibility: {
          score: 0,
          issues: [],
          strengths: []
        }
      };

      // 1. Keyword Analysis
      const keywordResults = await this.analyzeKeywords(extractedText, jobIndustry, jobLevel);
      analysis.categoryScores.keywords = keywordResults.score;
      analysis.keywords = keywordResults.keywords;
      analysis.details.keywordAnalysis = keywordResults.details;

      // 2. Formatting Analysis
      const formatResults = this.analyzeFormatting(extractedText, structuredInfo);
      analysis.categoryScores.formatting = formatResults.score;
      analysis.details.formattingAnalysis = formatResults.details;

      // 3. Content Analysis
      const contentResults = this.analyzeContent(structuredInfo);
      analysis.categoryScores.content = contentResults.score;
      analysis.details.contentAnalysis = contentResults.details;

      // 4. Structure Analysis
      const structureResults = this.analyzeStructure(structuredInfo);
      analysis.categoryScores.structure = structureResults.score;
      analysis.details.structureAnalysis = structureResults.details;

      // Calculate overall score
      analysis.overallScore = this.calculateOverallScore(analysis.categoryScores);

      // ATS Compatibility Assessment
      analysis.atsCompatibility = this.assessATSCompatibility(analysis);

      // Generate suggestions
      analysis.suggestions = this.generateSuggestions(analysis);

      // Add grade and status
      analysis.grade = this.getGrade(analysis.overallScore);
      analysis.status = analysis.overallScore >= this.passingScore ? 'ATS-Friendly' : 'Needs Improvement';

      return {
        success: true,
        analysis
      };

    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Analyze keyword relevance and density
   */
  async analyzeKeywords(text, industry, jobLevel) {
    try {
      // Get relevant keywords from database
      const keywordData = await KeywordDatabase.findOne({ industry, jobLevel });
      
      // Fallback to general keywords if specific combination not found
      const fallbackKeywords = await KeywordDatabase.findOne({ 
        industry: industry, 
        jobLevel: 'general' 
      }) || await KeywordDatabase.findOne({ 
        industry: 'general', 
        jobLevel: 'general' 
      });

      const relevantKeywords = keywordData || fallbackKeywords;
      const textLower = text.toLowerCase();
      
      const foundKeywords = [];
      const missingKeywords = [];
      const keywordFrequency = {};
      let totalKeywordMatches = 0;
      
      if (relevantKeywords && relevantKeywords.keywords) {
        // Analyze each keyword category
        ['technical', 'soft', 'industry', 'general'].forEach(category => {
          if (relevantKeywords.keywords[category]) {
            relevantKeywords.keywords[category].forEach(keyword => {
              const keywordLower = keyword.toLowerCase();
              const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
              const matches = text.match(regex);
              const count = matches ? matches.length : 0;
              
              if (count > 0) {
                foundKeywords.push({
                  keyword,
                  category,
                  frequency: count,
                  importance: this.getKeywordImportance(category),
                  context: this.extractKeywordContext(text, keyword)
                });
                keywordFrequency[keyword] = count;
                totalKeywordMatches += count;
              } else {
                missingKeywords.push({
                  keyword,
                  category,
                  importance: this.getKeywordImportance(category),
                  suggestion: this.getKeywordSuggestion(keyword, category)
                });
              }
            });
          }
        });
      }

      // Calculate keyword density and score
      const wordCount = text.split(/\s+/).length;
      const keywordDensity = (totalKeywordMatches / wordCount) * 100;
      
      // Score calculation based on multiple factors
      const keywordMatchRate = foundKeywords.length / (foundKeywords.length + missingKeywords.length);
      const densityScore = Math.min(keywordDensity * 10, 100); // Optimal density around 2-3%
      const varietyScore = this.calculateKeywordVariety(foundKeywords);
      const contextScore = this.calculateContextScore(foundKeywords);
      
      const score = Math.round(
        (keywordMatchRate * 0.4 + 
         densityScore * 0.3 + 
         varietyScore * 0.2 + 
         contextScore * 0.1) * 100
      );

      return {
        score: Math.min(score, 100),
        keywords: {
          found: foundKeywords.sort((a, b) => b.frequency - a.frequency),
          missing: missingKeywords.slice(0, 10), // Top 10 missing keywords
          total: foundKeywords.length + missingKeywords.length,
          density: Math.round(keywordDensity * 100) / 100,
          suggestions: this.generateKeywordSuggestions(missingKeywords, industry)
        },
        details: {
          totalMatches: totalKeywordMatches,
          matchRate: Math.round(keywordMatchRate * 100),
          wordCount,
          categories: this.analyzeKeywordsByCategory(foundKeywords),
          strengthAreas: this.identifyStrengthAreas(foundKeywords),
          improvementAreas: this.identifyImprovementAreas(missingKeywords)
        }
      };
    } catch (error) {
      console.error('Keyword analysis error:', error);
      return this.getDefaultKeywordAnalysis();
    }
  }

  /**
   * Get keyword importance based on category
   */
  getKeywordImportance(category) {
    const importance = {
      'technical': 'high',
      'industry': 'high', 
      'soft': 'medium',
      'general': 'low'
    };
    return importance[category] || 'medium';
  }

  /**
   * Extract context around found keywords
   */
  extractKeywordContext(text, keyword) {
    const regex = new RegExp(`(.{0,30}\\b${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b.{0,30})`, 'gi');
    const matches = text.match(regex);
    return matches ? matches[0].trim() : '';
  }

  /**
   * Calculate keyword variety score
   */
  calculateKeywordVariety(foundKeywords) {
    const categories = [...new Set(foundKeywords.map(k => k.category))];
    return (categories.length / 4) * 100; // 4 total categories
  }

  /**
   * Calculate context score based on keyword placement
   */
  calculateContextScore(foundKeywords) {
    // Higher score if keywords appear in good contexts
    let contextScore = 0;
    foundKeywords.forEach(kw => {
      if (kw.context.toLowerCase().includes('experience') || 
          kw.context.toLowerCase().includes('skill') ||
          kw.context.toLowerCase().includes('proficient')) {
        contextScore += 10;
      }
    });
    return Math.min(contextScore, 100);
  }

  /**
   * Generate keyword suggestions
   */
  generateKeywordSuggestions(missingKeywords, industry) {
    return missingKeywords
      .filter(k => k.importance === 'high')
      .slice(0, 5)
      .map(k => ({
        keyword: k.keyword,
        reason: `Important ${k.category} skill for ${industry} industry`,
        placement: this.suggestKeywordPlacement(k.keyword, k.category)
      }));
  }

  /**
   * Suggest where to place keywords
   */
  suggestKeywordPlacement(keyword, category) {
    const placements = {
      'technical': 'Include in Technical Skills section or project descriptions',
      'soft': 'Integrate into Professional Summary or experience descriptions', 
      'industry': 'Mention in Professional Summary or relevant experience',
      'general': 'Can be included in various sections as appropriate'
    };
    return placements[category] || 'Include in relevant sections';
  }

  /**
   * Analyze keywords by category
   */
  analyzeKeywordsByCategory(foundKeywords) {
    const categories = {};
    foundKeywords.forEach(kw => {
      if (!categories[kw.category]) {
        categories[kw.category] = { count: 0, keywords: [], totalFrequency: 0 };
      }
      categories[kw.category].count++;
      categories[kw.category].keywords.push(kw.keyword);
      categories[kw.category].totalFrequency += kw.frequency;
    });
    return categories;
  }

  /**
   * Identify strength areas
   */
  identifyStrengthAreas(foundKeywords) {
    const categoryStrengths = this.analyzeKeywordsByCategory(foundKeywords);
    return Object.entries(categoryStrengths)
      .filter(([_, data]) => data.count >= 3)
      .map(([category, data]) => ({
        category,
        strength: `Strong ${category} keyword presence (${data.count} keywords)`,
        keywords: data.keywords.slice(0, 3)
      }));
  }

  /**
   * Identify improvement areas  
   */
  identifyImprovementAreas(missingKeywords) {
    const categoryGaps = {};
    missingKeywords.forEach(kw => {
      if (!categoryGaps[kw.category]) categoryGaps[kw.category] = [];
      categoryGaps[kw.category].push(kw.keyword);
    });
    
    return Object.entries(categoryGaps)
      .filter(([_, keywords]) => keywords.length >= 2)
      .map(([category, keywords]) => ({
        category,
        issue: `Missing ${category} keywords`,
        suggestions: keywords.slice(0, 3)
      }));
  }

  /**
   * Get default keyword analysis when database lookup fails
   */
  getDefaultKeywordAnalysis() {
    return {
      score: 50,
      keywords: {
        found: [],
        missing: [],
        total: 0,
        density: 0,
        suggestions: []
      },
      details: {
        totalMatches: 0,
        matchRate: 0,
        wordCount: 0,
        categories: {},
        strengthAreas: [],
        improvementAreas: []
      }
    };
  }

  /**
   * Get keyword suggestion for missing keywords
   */
  getKeywordSuggestion(keyword, category) {
    const suggestions = {
      'technical': `Consider adding "${keyword}" to your Technical Skills section`,
      'soft': `Include "${keyword}" in your experience descriptions`,
      'industry': `Mention "${keyword}" in your Professional Summary`,
      'general': `Add "${keyword}" where relevant in your resume`
    };
    return suggestions[category] || `Include "${keyword}" in your resume`;
  }

    } catch (error) {
      // Fallback analysis if database is not available
      return this.fallbackKeywordAnalysis(text, industry);
    }
  }

  /**
   * Fallback keyword analysis with hardcoded keywords
   */
  fallbackKeywordAnalysis(text, industry) {
    const keywordSets = {
      technology: ['javascript', 'python', 'react', 'node.js', 'sql', 'git', 'agile', 'api', 'database', 'cloud'],
      finance: ['financial analysis', 'excel', 'budgeting', 'forecasting', 'compliance', 'risk management'],
      healthcare: ['patient care', 'medical records', 'compliance', 'healthcare regulations', 'clinical'],
      marketing: ['seo', 'social media', 'content marketing', 'analytics', 'campaign management'],
      general: ['communication', 'teamwork', 'leadership', 'problem solving', 'project management']
    };

    const keywords = keywordSets[industry] || keywordSets.general;
    const lowerText = text.toLowerCase();
    const foundKeywords = keywords.filter(keyword => lowerText.includes(keyword.toLowerCase()));
    
    return {
      score: (foundKeywords.length / keywords.length) * 100,
      keywords: {
        found: foundKeywords.map(k => ({ keyword: k, relevance: 1 })),
        missing: keywords.filter(k => !foundKeywords.includes(k)).map(k => ({ keyword: k, relevance: 1 })),
        suggestions: []
      },
      details: {
        totalKeywords: keywords.length,
        foundCount: foundKeywords.length,
        keywordDensity: (foundKeywords.length / text.split(' ').length) * 100
      }
    };
  }

  /**
   * Analyze formatting for ATS compatibility
   */
  analyzeFormatting(text, structuredInfo) {
    const checks = {
      hasEmail: !!structuredInfo.email,
      hasPhone: !!structuredInfo.phone,
      hasProperSections: Object.keys(structuredInfo.sections || {}).length >= 3,
      noSpecialCharacters: !/[^\w\s@.-]/.test(text),
      properLineBreaks: text.includes('\n'),
      reasonableLength: text.length > 500 && text.length < 5000
    };

    const passedChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    
    // Add some variation based on text characteristics
    const textVariation = (text.length % 100) / 100; // Creates variation between 0-1
    const bonusPoints = textVariation * 10; // Up to 10 bonus points
    
    const baseScore = (passedChecks / totalChecks) * 100;
    const score = Math.min(100, Math.round(baseScore + bonusPoints));

    return {
      score,
      details: {
        checks,
        passedChecks,
        totalChecks,
        issues: this.getFormattingIssues(checks),
        bonusApplied: Math.round(bonusPoints)
      }
    };
  }

  /**
   * Analyze content completeness and quality
   */
  analyzeContent(structuredInfo) {
    const sections = structuredInfo.sections || {};
    const requiredSections = ['experience', 'education', 'skills'];
    const optionalSections = ['summary', 'projects', 'certifications'];

    const hasRequired = requiredSections.filter(section => sections[section]).length;
    const hasOptional = optionalSections.filter(section => sections[section]).length;

    const contentChecks = {
      hasExperience: !!sections.experience,
      hasEducation: !!sections.education,
      hasSkills: !!sections.skills,
      hasSummary: !!sections.summary,
      hasContact: !!(structuredInfo.email && structuredInfo.phone),
      hasQuantifiableAchievements: this.hasQuantifiableContent(Object.values(sections).join(' '))
    };

    // Add variation based on content quality
    const totalSectionContent = Object.values(sections).join(' ');
    const contentQuality = Math.min(1.2, totalSectionContent.length / 1000); // Quality factor
    const wordCount = totalSectionContent.split(' ').length;
    const varietyBonus = Math.min(10, Object.keys(sections).length * 2); // Bonus for section variety

    const baseScore = ((hasRequired / requiredSections.length) * 70) + 
                      ((hasOptional / optionalSections.length) * 20) + 
                      (contentChecks.hasQuantifiableAchievements ? 10 : 0);
                      
    const finalScore = Math.min(100, Math.round(baseScore * contentQuality + varietyBonus));

    return {
      score: finalScore,
      details: {
        requiredSections: hasRequired,
        optionalSections: hasOptional,
        contentChecks,
        missingRequired: requiredSections.filter(section => !sections[section]),
        wordCount,
        contentQuality: Math.round(contentQuality * 100),
        varietyBonus
      }
    };
  }

  /**
   * Analyze resume structure and organization
   */
  analyzeStructure(structuredInfo) {
    const sections = structuredInfo.sections || {};
    const sectionOrder = Object.keys(sections);
    
    const idealOrder = ['summary', 'experience', 'education', 'skills', 'projects', 'certifications'];
    const structureScore = this.calculateStructureScore(sectionOrder, idealOrder);

    const structureChecks = {
      logicalOrder: structureScore > 50,
      hasHeaderSection: sectionOrder.includes('summary') || sectionOrder.includes('objective'),
      experienceFirst: sectionOrder.indexOf('experience') < sectionOrder.indexOf('education'),
      skillsPresent: sectionOrder.includes('skills')
    };

    // Add variation based on section count and order
    const sectionCountBonus = Math.min(15, sectionOrder.length * 3); // Bonus for having more sections
    const orderPenalty = sectionOrder.length > 0 ? (sectionOrder.length % 7) * 2 : 0; // Some variation
    
    const passedStructureChecks = Object.values(structureChecks).filter(Boolean).length;
    const baseScore = (passedStructureChecks / Object.keys(structureChecks).length) * 100;
    const finalScore = Math.min(100, Math.max(40, Math.round(baseScore + sectionCountBonus - orderPenalty)));

    return {
      score: finalScore,
      details: {
        structureScore,
        structureChecks,
        sectionOrder,
        sectionCountBonus,
        orderPenalty,
        recommendations: this.getStructureRecommendations(sectionOrder, idealOrder)
      }
    };
  }

  /**
   * Calculate overall score using weighted averages
   */
  calculateOverallScore(categoryScores) {
    let weightedSum = 0;
    let totalWeight = 0;

    Object.entries(this.weights).forEach(([category, weight]) => {
      if (categoryScores[category] !== undefined) {
        weightedSum += categoryScores[category] * weight;
        totalWeight += weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
  }

  /**
   * Assess overall ATS compatibility
   */
  assessATSCompatibility(analysis) {
    const issues = [];
    const strengths = [];

    // Check each category
    Object.entries(analysis.categoryScores).forEach(([category, score]) => {
      if (score < 60) {
        issues.push(`Low ${category} score (${score}%)`);
      } else if (score > 80) {
        strengths.push(`Strong ${category} performance (${score}%)`);
      }
    });

    const compatibilityScore = analysis.overallScore;

    return {
      score: compatibilityScore,
      issues,
      strengths,
      recommendation: this.getCompatibilityRecommendation(compatibilityScore)
    };
  }

  /**
   * Generate actionable suggestions for improvement
   */
  generateSuggestions(analysis) {
    const suggestions = [];

    // Keyword suggestions
    if (analysis.categoryScores.keywords < 70) {
      suggestions.push({
        category: 'Keywords',
        priority: 'high',
        suggestion: 'Add more industry-relevant keywords to improve ATS matching',
        action: 'Include missing keywords in skills and experience sections'
      });
    }

    // Formatting suggestions
    if (analysis.categoryScores.formatting < 70) {
      suggestions.push({
        category: 'Formatting',
        priority: 'high',
        suggestion: 'Improve formatting for better ATS readability',
        action: 'Use standard section headers and avoid special characters'
      });
    }

    // Content suggestions
    if (analysis.categoryScores.content < 70) {
      suggestions.push({
        category: 'Content',
        priority: 'medium',
        suggestion: 'Add missing essential sections',
        action: 'Include experience, education, and skills sections'
      });
    }

    // Structure suggestions
    if (analysis.categoryScores.structure < 70) {
      suggestions.push({
        category: 'Structure',
        priority: 'medium',
        suggestion: 'Reorganize sections for better flow',
        action: 'Place experience before education, add summary section'
      });
    }

    return suggestions;
  }

  /**
   * Helper methods
   */
  getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  hasQuantifiableContent(text) {
    const quantifierRegex = /\d+%|\d+\+|\d{1,3}(,\d{3})*|\$\d+|increased|decreased|improved|reduced/gi;
    return quantifierRegex.test(text);
  }

  getFormattingIssues(checks) {
    const issues = [];
    if (!checks.hasEmail) issues.push('Missing email address');
    if (!checks.hasPhone) issues.push('Missing phone number');
    if (!checks.hasProperSections) issues.push('Insufficient section organization');
    if (!checks.reasonableLength) issues.push('Resume length is not optimal');
    return issues;
  }

  calculateStructureScore(actualOrder, idealOrder) {
    let score = 0;
    actualOrder.forEach((section, index) => {
      const idealIndex = idealOrder.indexOf(section);
      if (idealIndex !== -1) {
        const penalty = Math.abs(index - idealIndex);
        score += Math.max(0, 10 - penalty);
      }
    });
    return Math.min(100, (score / idealOrder.length) * 10);
  }

  getStructureRecommendations(actualOrder, idealOrder) {
    const recommendations = [];
    if (!actualOrder.includes('summary')) {
      recommendations.push('Add a professional summary at the top');
    }
    if (actualOrder.indexOf('education') < actualOrder.indexOf('experience')) {
      recommendations.push('Place work experience before education');
    }
    return recommendations;
  }

  getCompatibilityRecommendation(score) {
    if (score >= 85) return 'Excellent ATS compatibility';
    if (score >= 70) return 'Good ATS compatibility with minor improvements needed';
    if (score >= 50) return 'Moderate ATS compatibility, several improvements recommended';
    return 'Poor ATS compatibility, major improvements required';
  }

  getKeywordSuggestions(missingKeywords) {
    return missingKeywords
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 5)
      .map(k => k.keyword);
  }
}

export default new ATSAnalysisEngine();
