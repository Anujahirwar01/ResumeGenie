import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  BarChart3,
  Target,
  FileText,
  Award,
  Lightbulb,
  Star,
  Edit3,
  Eye,
  AlertCircle,
  Search,
  Calendar,
  Mail,
  Phone,
  MapPin,
  User,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const ExpertAnalysisResults = ({ analysisData, resumeText = "" }) => {
  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No analysis data available</p>
      </div>
    );
  }

  // Analysis functions for missing elements
  const analyzeMissingElements = () => {
    const text = resumeText.toLowerCase();
    const missing = [];
    const present = [];

    // Contact Information
    const hasEmail = /@/.test(text);
    const hasPhone = /\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
    const hasLocation = /(city|state|country)/.test(text) || /\b[A-Z][a-z]+,\s*[A-Z]{2}\b/.test(resumeText);
    
    // Professional Summary
    const hasSummary = /(summary|objective|profile)/.test(text) && text.length > 100;
    
    // Experience Section
    const hasExperience = /(experience|employment|work history)/.test(text);
    const hasQuantifiedAchievements = /\d+%|\$[\d,]+|\d+[kKmMbB]|\d+\s*(years?|months?)/.test(text);
    const hasActionVerbs = /(achieved|improved|increased|developed|led|managed|created|implemented|designed|optimized|delivered)/i.test(text);
    
    // Education
    const hasEducation = /(education|degree|university|college|bachelor|master|phd)/.test(text);
    
    // Skills
    const hasSkills = /(skills|technologies|tools|programming|software)/.test(text);
    const hasTechnicalSkills = /(javascript|python|react|java|sql|aws|git|html|css|node|angular|vue)/.test(text);
    
    // Professional Details
    const hasWorkDates = /\d{4}/.test(text) || /(present|current)/.test(text);
    const hasJobTitles = /(developer|engineer|manager|analyst|designer|specialist|coordinator)/.test(text);

    // Check what's missing vs present
    if (hasEmail) present.push("Email address"); else missing.push("Email address");
    if (hasPhone) present.push("Phone number"); else missing.push("Phone number");
    if (hasLocation) present.push("Location/Address"); else missing.push("Location/Address");
    if (hasSummary) present.push("Professional summary"); else missing.push("Professional summary");
    if (hasExperience) present.push("Work experience section"); else missing.push("Work experience section");
    if (hasQuantifiedAchievements) present.push("Quantified achievements"); else missing.push("Quantified achievements (numbers, percentages, metrics)");
    if (hasActionVerbs) present.push("Strong action verbs"); else missing.push("Strong action verbs");
    if (hasEducation) present.push("Education section"); else missing.push("Education section");
    if (hasSkills) present.push("Skills section"); else missing.push("Skills section");
    if (hasTechnicalSkills) present.push("Technical skills"); else missing.push("Relevant technical skills");
    if (hasWorkDates) present.push("Employment dates"); else missing.push("Employment dates");
    if (hasJobTitles) present.push("Clear job titles"); else missing.push("Clear job titles");

    return { missing, present };
  };

  const getIssuesInResume = () => {
    const text = resumeText;
    const issues = [];

    // Length issues
    if (text.length < 500) {
      issues.push({
        type: "length",
        severity: "high",
        message: "Resume is too short - lacks sufficient detail",
        suggestion: "Expand with more achievements and experiences"
      });
    } else if (text.length > 2000) {
      issues.push({
        type: "length", 
        severity: "medium",
        message: "Resume may be too long - could overwhelm recruiters",
        suggestion: "Consider condensing to most relevant information"
      });
    }

    // Formatting issues
    if (!/\n/.test(text) || text.split('\n').length < 5) {
      issues.push({
        type: "formatting",
        severity: "high", 
        message: "Poor formatting - lacks clear sections",
        suggestion: "Add clear section breaks and bullet points"
      });
    }

    // Content issues
    if (!/\d/.test(text)) {
      issues.push({
        type: "content",
        severity: "high",
        message: "No quantifiable achievements or metrics",
        suggestion: "Add specific numbers, percentages, and measurable results"
      });
    }

    if (text.toLowerCase().includes("responsible for") || text.toLowerCase().includes("duties included")) {
      issues.push({
        type: "language",
        severity: "medium",
        message: "Uses passive language instead of action-oriented descriptions",
        suggestion: "Replace with strong action verbs and achievement-focused statements"
      });
    }

    return issues;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 65) return 'text-blue-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 65) return 'bg-blue-50 border-blue-200';
    if (score >= 50) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  // Extract scores from the enhanced analysis structure
  const scores = analysisData.scores || {
    structureFormatting: analysisData.categories?.formatting?.score || 0,
    contentQuality: analysisData.categories?.content?.score || 0,
    atsOptimization: analysisData.categories?.keywords?.score || 0,
    overallImpact: analysisData.categories?.structure?.score || 0
  };

  const expertReview = analysisData.expertReview || {
    summary: "Analysis completed successfully.",
    topStrengths: ["Professional presentation"],
    topWeaknesses: ["Needs more quantifiable achievements"],
    actionableImprovements: ["Add professional summary", "Include metrics"],
    rewrittenBullets: []
  };

  // Extract data for analysis
  const missingAnalysis = analyzeMissingElements();
  const resumeIssues = getIssuesInResume();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Expert Resume Analysis</h1>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <div className="text-4xl font-bold text-gray-800">
            {Math.round(analysisData.atsScore || analysisData.overallScore || 0)}/100
          </div>
          <div className={`px-4 py-2 rounded-full text-lg font-semibold ${getGradeColor(analysisData.grade || 'C')}`}>
            Grade: {analysisData.grade || 'C'}
          </div>
        </div>
      </div>

      {/* Main Resume Sections Analysis */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
        <div className="flex items-center mb-6">
          <FileText className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-blue-800">📋 Essential Resume Sections</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Contact Information */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Mail className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Contact Information</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                {/@/.test(resumeText) ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700">Email found</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-red-700">Email missing</span>
                  </>
                )}
              </div>
              <div className="flex items-center text-sm">
                {/\d{3}[-.\s]?\d{3}[-.\s]?\d{4}/.test(resumeText) ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700">Phone found</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-red-700">Phone missing</span>
                  </>
                )}
              </div>
              <div className="flex items-center text-sm">
                {/(address|location|city|state)/i.test(resumeText) ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700">Location found</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-yellow-700">Location recommended</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center mb-3">
              <User className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Professional Summary</h3>
            </div>
            <div className="space-y-2">
              {/(summary|objective|profile|about)/i.test(resumeText) && resumeText.length > 200 ? (
                <>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700">Summary present</span>
                  </div>
                  <p className="text-xs text-gray-600">Well-structured professional summary found</p>
                </>
              ) : (
                <>
                  <div className="flex items-center text-sm">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-red-700">Summary missing/weak</span>
                  </div>
                  <p className="text-xs text-gray-600">Add a compelling 2-3 sentence summary</p>
                </>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Target className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Skills</h3>
            </div>
            <div className="space-y-2">
              {/(skills|technologies|competencies|proficiencies)/i.test(resumeText) ? (
                <>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700">Skills section found</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Technical and soft skills analysis complete
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center text-sm">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-red-700">Skills section missing</span>
                  </div>
                  <p className="text-xs text-gray-600">Add technical and soft skills relevant to your field</p>
                </>
              )}
            </div>
          </div>

          {/* Work Experience */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center mb-3">
              <Briefcase className="w-5 h-5 text-orange-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Work Experience</h3>
            </div>
            <div className="space-y-2">
              {/(experience|employment|work|career|professional|job)/i.test(resumeText) ? (
                <>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700">Experience section found</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {(resumeText.match(/\d{4}/g) || []).length} years/dates mentioned
                  </p>
                  {!/\d+%|\$\d+|\d+,\d+|\d+ (million|thousand|k\b)/i.test(resumeText) && (
                    <p className="text-xs text-yellow-600">💡 Add quantifiable achievements</p>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center text-sm">
                    <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    <span className="text-red-700">Experience section missing</span>
                  </div>
                  <p className="text-xs text-gray-600">Add work history with achievements and dates</p>
                </>
              )}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
            <div className="flex items-center mb-3">
              <GraduationCap className="w-5 h-5 text-indigo-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Education</h3>
            </div>
            <div className="space-y-2">
              {/(education|degree|university|college|school|bachelor|master|phd|certification|diploma)/i.test(resumeText) ? (
                <>
                  <div className="flex items-center text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-green-700">Education found</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {((resumeText.match(/\b(bachelor|master|phd|doctorate|associate|certificate|diploma|degree)\b/gi) || []).length)} qualification(s) detected
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 mr-2" />
                    <span className="text-yellow-700">Education section missing</span>
                  </div>
                  <p className="text-xs text-gray-600">Add relevant education and certifications</p>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Section Completeness Summary */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-blue-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Award className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-semibold text-gray-800">Section Completeness</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {[
                /@/.test(resumeText),
                /(summary|objective|profile|about)/i.test(resumeText) && resumeText.length > 200,
                /(skills|technologies|competencies)/i.test(resumeText),
                /(experience|employment|work|career)/i.test(resumeText),
                /(education|degree|university|college)/i.test(resumeText)
              ].filter(Boolean).length}/5
            </div>
          </div>
          <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${([
                  /@/.test(resumeText),
                  /(summary|objective|profile|about)/i.test(resumeText) && resumeText.length > 200,
                  /(skills|technologies|competencies)/i.test(resumeText),
                  /(experience|employment|work|career)/i.test(resumeText),
                  /(education|degree|university|college)/i.test(resumeText)
                ].filter(Boolean).length / 5) * 100}%` 
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {[
              /@/.test(resumeText),
              /(summary|objective|profile|about)/i.test(resumeText) && resumeText.length > 200,
              /(skills|technologies|competencies)/i.test(resumeText),
              /(experience|employment|work|career)/i.test(resumeText),
              /(education|degree|university|college)/i.test(resumeText)
            ].filter(Boolean).length === 5 
              ? "🎉 All essential sections present!" 
              : `Complete ${5 - [
                  /@/.test(resumeText),
                  /(summary|objective|profile|about)/i.test(resumeText) && resumeText.length > 200,
                  /(skills|technologies|competencies)/i.test(resumeText),
                  /(experience|employment|work|career)/i.test(resumeText),
                  /(education|degree|university|college)/i.test(resumeText)
                ].filter(Boolean).length} more section(s) for a stronger resume`
            }
          </p>
        </div>
      </div>

      {/* Resume Issues - Highlighted Problems */}
      {resumeIssues.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-red-800">🚨 Critical Issues Found</h2>
          </div>
          <div className="space-y-4">
            {resumeIssues.map((issue, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                issue.severity === 'high' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${
                        issue.severity === 'high' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>
                        {issue.severity.toUpperCase()} PRIORITY
                      </span>
                      <span className="ml-2 text-sm font-medium text-gray-600 capitalize">
                        {issue.type} Issue
                      </span>
                    </div>
                    <p className="text-red-700 font-medium mb-2">{issue.message}</p>
                    <p className="text-green-700 text-sm">
                      <strong>💡 Fix:</strong> {issue.suggestion}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume Content Analysis - Show Real Data */}
      {analysisData.structuredData && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-center mb-4">
            <Eye className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-blue-800">📄 Your Resume Content Analysis</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Personal Information</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-medium">Name:</span>
                  <span className={`ml-2 ${analysisData.structuredData.personalInfo?.name ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisData.structuredData.personalInfo?.name || '❌ Not found'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  <span className="font-medium">Email:</span>
                  <span className={`ml-2 ${analysisData.structuredData.contactInfo?.email ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisData.structuredData.contactInfo?.email || '❌ Not found'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  <span className="font-medium">Phone:</span>
                  <span className={`ml-2 ${analysisData.structuredData.contactInfo?.phone ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisData.structuredData.contactInfo?.phone || '❌ Not found'}
                  </span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="font-medium">Location:</span>
                  <span className={`ml-2 ${analysisData.structuredData.contactInfo?.location ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisData.structuredData.contactInfo?.location || '❌ Not found'}
                  </span>
                </div>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <FileText className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Professional Summary</h3>
              </div>
              {analysisData.structuredData.summary ? (
                <p className="text-sm text-green-700 bg-green-50 p-2 rounded">
                  ✅ {analysisData.structuredData.summary.substring(0, 150)}...
                </p>
              ) : (
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  ❌ No professional summary found. Add a 2-3 sentence summary highlighting your key qualifications.
                </p>
              )}
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <Briefcase className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Work Experience</h3>
              </div>
              {analysisData.structuredData.experience && analysisData.structuredData.experience.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-700">✅ {analysisData.structuredData.experience.length} positions found</p>
                  {analysisData.structuredData.experience.slice(0, 2).map((exp, index) => (
                    <div key={index} className="bg-green-50 p-2 rounded text-xs">
                      <p className="font-medium">{exp.title}</p>
                      {exp.company && <p className="text-gray-600">{exp.company}</p>}
                      {exp.duration && <p className="text-gray-600">{exp.duration}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  ❌ No work experience section found. Add your professional experience with job titles, companies, and achievements.
                </p>
              )}
            </div>

            {/* Education */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Education</h3>
              </div>
              {analysisData.structuredData.education && analysisData.structuredData.education.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-700">✅ {analysisData.structuredData.education.length} education entry(ies) found</p>
                  {analysisData.structuredData.education.slice(0, 2).map((edu, index) => (
                    <div key={index} className="bg-green-50 p-2 rounded text-xs">
                      <p className="font-medium">{edu.degree}</p>
                      {edu.year && <p className="text-gray-600">Year: {edu.year}</p>}
                      {edu.gpa && <p className="text-gray-600">GPA: {edu.gpa}</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  ❌ No education section found. Add your degrees, schools, and graduation dates.
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <Target className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Skills</h3>
              </div>
              {analysisData.structuredData.skills && analysisData.structuredData.skills.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-700">✅ {analysisData.structuredData.skills.length} skills found</p>
                  <div className="flex flex-wrap gap-1">
                    {analysisData.structuredData.skills.slice(0, 8).map((skill, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  ❌ No skills section found. Add relevant technical and soft skills.
                </p>
              )}
            </div>

            {/* Quantifiable Metrics */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center mb-3">
                <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-blue-800">Quantifiable Results</h3>
              </div>
              {analysisData.structuredData.metrics && analysisData.structuredData.metrics.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-green-700">✅ {analysisData.structuredData.metrics.length} metrics found</p>
                  <div className="space-y-1">
                    {analysisData.structuredData.metrics.slice(0, 4).map((metric, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded inline-block mr-1 mb-1">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-red-700 bg-red-50 p-2 rounded">
                  ❌ No quantifiable achievements found. Add specific numbers, percentages, and measurable results.
                </p>
              )}
            </div>
          </div>

          {/* Language Quality Analysis */}
          {analysisData.structuredData.languageQuality && (
            <div className="mt-6 bg-white rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-3">📝 Language Quality Analysis</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className={`text-lg font-bold ${analysisData.structuredData.languageQuality.actionVerbCount > 5 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisData.structuredData.languageQuality.actionVerbCount}
                  </div>
                  <div className="text-gray-600">Action Verbs</div>
                  <div className="text-xs text-gray-500">Should be 8+</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${analysisData.structuredData.languageQuality.passiveLanguageCount < 3 ? 'text-green-600' : 'text-red-600'}`}>
                    {analysisData.structuredData.languageQuality.passiveLanguageCount}
                  </div>
                  <div className="text-gray-600">Passive Language</div>
                  <div className="text-xs text-gray-500">Should be &lt;3</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${analysisData.structuredData.languageQuality.readabilityScore > 60 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(analysisData.structuredData.languageQuality.readabilityScore)}
                  </div>
                  <div className="text-gray-600">Readability</div>
                  <div className="text-xs text-gray-500">0-100 scale</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${analysisData.structuredData.languageQuality.strongLanguageRatio > 0.7 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.round(analysisData.structuredData.languageQuality.strongLanguageRatio * 100)}%
                  </div>
                  <div className="text-gray-600">Strong Language</div>
                  <div className="text-xs text-gray-500">Target: 70%+</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Missing Elements */}
      {missingAnalysis.missing.length > 0 && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <XCircle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold text-red-800">❌ Missing Essential Elements</h2>
            </div>
            <div className="space-y-3">
              {missingAnalysis.missing.map((item, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg border border-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-red-700 font-medium">{item}</span>
                    <div className="text-red-600 text-sm mt-1">
                      {item.includes('Email') && "Add your professional email address"}
                      {item.includes('Phone') && "Include your phone number for contact"}
                      {item.includes('Location') && "Add your city and state/country"}
                      {item.includes('summary') && "Write a 2-3 sentence professional summary"}
                      {item.includes('experience') && "Add your work experience with job titles and descriptions"}
                      {item.includes('achievements') && "Include specific numbers: percentages, dollar amounts, timeframes"}
                      {item.includes('action verbs') && "Use words like 'achieved', 'improved', 'led', 'developed'"}
                      {item.includes('Education') && "List your degrees, schools, and graduation dates"}
                      {item.includes('Skills') && "Create a dedicated skills section"}
                      {item.includes('technical') && "Add programming languages, tools, and technologies"}
                      {item.includes('dates') && "Include start and end dates for all positions"}
                      {item.includes('titles') && "Clearly state your job titles for each role"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Present Elements */}
        {missingAnalysis.present.length > 0 && (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
              <h2 className="text-xl font-semibold text-green-800">✅ Elements Already Present</h2>
            </div>
            <div className="space-y-2">
              {missingAnalysis.present.map((item, index) => (
                <div key={index} className="flex items-center p-2 bg-white rounded-lg border border-green-200">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-green-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
  )

      {/* Expert Summary */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-800">Expert Summary</h2>
        </div>
        <p className="text-gray-700 leading-relaxed text-lg">
          {expertReview.summary}
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(scores.structureFormatting)}`}>
          <div className="flex items-center justify-between mb-3">
            <BarChart3 className="w-6 h-6 text-gray-600" />
            <span className={`text-2xl font-bold ${getScoreColor(scores.structureFormatting)}`}>
              {Math.round(scores.structureFormatting)}/10
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Structure & Formatting</h3>
          <p className="text-sm text-gray-600">Resume organization and presentation</p>
        </div>

        <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(scores.contentQuality)}`}>
          <div className="flex items-center justify-between mb-3">
            <Target className="w-6 h-6 text-gray-600" />
            <span className={`text-2xl font-bold ${getScoreColor(scores.contentQuality)}`}>
              {Math.round(scores.contentQuality)}/10
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Content Quality</h3>
          <p className="text-sm text-gray-600">Impact and achievement focus</p>
        </div>

        <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(scores.atsOptimization)}`}>
          <div className="flex items-center justify-between mb-3">
            <CheckCircle className="w-6 h-6 text-gray-600" />
            <span className={`text-2xl font-bold ${getScoreColor(scores.atsOptimization)}`}>
              {Math.round(scores.atsOptimization)}/10
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">ATS Optimization</h3>
          <p className="text-sm text-gray-600">Keyword and format compatibility</p>
        </div>

        <div className={`p-6 rounded-xl border-2 ${getScoreBgColor(scores.overallImpact)}`}>
          <div className="flex items-center justify-between mb-3">
            <TrendingUp className="w-6 h-6 text-gray-600" />
            <span className={`text-2xl font-bold ${getScoreColor(scores.overallImpact)}`}>
              {Math.round(scores.overallImpact)}/10
            </span>
          </div>
          <h3 className="font-semibold text-gray-800 mb-1">Overall Impact</h3>
          <p className="text-sm text-gray-600">Market relevance and appeal</p>
        </div>
      </div>

      {/* Missing Elements Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold text-green-800">Top Strengths</h2>
          </div>
          <ul className="space-y-3">
            {expertReview.topStrengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <Star className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-green-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-red-800">Areas to Improve</h2>
          </div>
          <ul className="space-y-3">
            {expertReview.topWeaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <XCircle className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-red-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actionable Improvements */}
      <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
        <div className="flex items-center mb-4">
          <Lightbulb className="w-6 h-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-blue-800">Actionable Improvements</h2>
        </div>
        <div className="space-y-4">
          {expertReview.actionableImprovements.map((improvement, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-start">
                <div className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full mr-3 mt-0.5">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-blue-800" dangerouslySetInnerHTML={{ __html: improvement }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Rewrites */}
      {expertReview.rewrittenBullets && expertReview.rewrittenBullets.length > 0 && (
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center mb-4">
            <Edit3 className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-purple-800">Sample Rewrites</h2>
          </div>
          <div className="space-y-6">
            {expertReview.rewrittenBullets.map((bullet, index) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-purple-200">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-red-600 mb-1">❌ Before:</h4>
                    <p className="text-gray-700 italic">{bullet.before}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-green-600 mb-1">✅ After:</h4>
                    <p className="text-gray-800 font-medium">{bullet.after}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section Feedback */}
      {analysisData.sectionFeedback && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Detailed Section Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(analysisData.sectionFeedback).map(([section, feedback]) => (
              <div key={section} className="bg-white rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-800 capitalize mb-2">{section}</h3>
                <p className="text-gray-600 text-sm">{feedback}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    }

export default ExpertAnalysisResults;
