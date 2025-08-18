import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Star, 
  RotateCcw, 
  FileText, 
  BarChart3, 
  Wand2, 
  Crown,
  Users,
  MessageSquare,
  Target,
  TrendingUp,
  Lock,
  Plus,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ChevronDown,
  Download,
  Share2
} from 'lucide-react';
import { sampleAnalysisData } from '../data/sampleData';

const Dashboard = ({ analysisData }) => {
  const [activeTab, setActiveTab] = useState('latest');
  const [selectedFix, setSelectedFix] = useState(null);

  // Sample data - replace with actual analysis data
  const dashboardData = analysisData || sampleAnalysisData;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getIconForFix = (fixName) => {
    const iconMap = {
      'Readability': FileText,
      'Communication': MessageSquare,
      'Summary': Target,
      'Leadership': Crown,
      'Teamwork': Users,
      'Keywords': TrendingUp,
      'Formatting': BarChart3,
      'Content': FileText,
      'Structure': Target
    };
    return iconMap[fixName] || FileText;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">RESUME WORDED</h1>
              <span className="text-gray-400">|</span>
              <span className="text-blue-600 font-medium">SCORE MY RESUME</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>Career Coaches</option>
            </select>
            <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
              <option>More</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center space-x-2">
              <RotateCcw className="w-4 h-4" />
              <span>Re-score Resume</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen">
          {/* Navigation */}
          <div className="p-6 border-b border-gray-200">
            <button className="flex items-center space-x-2 text-blue-600">
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
          </div>

          {/* Overall Score */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(dashboardData.overallScore / 100) * 251.2} 251.2`}
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#fb923c" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">{dashboardData.overallScore}</span>
                  <span className="text-sm text-gray-500 font-medium">OVERALL</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top Fixes */}
          <div className="p-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Top Fixes</h3>
            <div className="space-y-3">
              {dashboardData.topFixes.map((fix, index) => {
                const IconComponent = getIconForFix(fix.name);
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => setSelectedFix(fix)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getPriorityColor(fix.priority)}`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{fix.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">{fix.score}</span>
                      {fix.priority === 'low' && <Lock className="w-4 h-4 text-gray-400" />}
                    </div>
                  </div>
                );
              })}
            </div>
            
            <button className="w-full mt-4 py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>10 MORE ISSUES</span>
            </button>
          </div>

          {/* Completed Section */}
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">Completed</h3>
            <button className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center justify-center space-x-2 hover:bg-blue-700 transition-colors">
              <Star className="w-4 h-4 fill-current" />
              <span>Unlock full report</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{dashboardData.greeting}</h2>
                <p className="text-gray-600">{dashboardData.welcomeMessage}</p>
              </div>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                HOW IT WORKS
              </button>
            </div>

            {/* Score Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'latest' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('latest')}
              >
                <Star className="w-4 h-4" />
                <span>LATEST SCORE</span>
              </button>
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'previous' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveTab('previous')}
              >
                <RotateCcw className="w-4 h-4" />
                <span>PREVIOUS SCORE</span>
              </button>
            </div>

            {/* Score Details */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Your resume scored {dashboardData.overallScore} out of 100.
              </h3>
              <p className="text-gray-600 leading-relaxed">
                You're on the right track, but there's room for improvement on your resume! While your resume does well in some areas, it falls short in others which are important to hiring managers and resume screeners. But don't worry - we'll show you how to make easy improvements to your resume, which will increase your score by 20+ points.
              </p>
            </div>

            {/* Resume Score Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>YOUR RESUME</span>
                <span>TOP RESUMES</span>
              </div>
              <div className="relative">
                <div className="h-3 bg-gradient-to-r from-red-400 via-yellow-400 via-orange-400 to-green-400 rounded-full"></div>
                <div 
                  className="absolute top-0 h-3 w-1 bg-blue-600 rounded-full"
                  style={{ left: `${dashboardData.overallScore}%`, transform: 'translateX(-50%)' }}
                ></div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>TOP<br/>RESUMES</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 mb-6">
            <button className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
              <Crown className="w-5 h-5" />
              <span>GET PRO</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors">
              <BarChart3 className="w-5 h-5" />
              <span>LINE ANALYSIS</span>
            </button>
            <button className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
              <Wand2 className="w-5 h-5" />
              <span>MAGIC WRITE</span>
            </button>
          </div>
        </div>

        {/* Right Panel - Resume Preview */}
        <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{dashboardData.resumeData.name}</h1>
              <div className="space-y-1 text-sm text-blue-600">
                <div className="flex items-center space-x-1">
                  <Mail className="w-4 h-4" />
                  <span>{dashboardData.resumeData.email}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{dashboardData.resumeData.phone}</span>
                  </div>
                  <span>|</span>
                  <a href="#" className="hover:underline">{dashboardData.resumeData.linkedin}</a>
                  <span>|</span>
                  <a href="#" className="hover:underline">{dashboardData.resumeData.github}</a>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Summary</h2>
              <p className="text-sm text-gray-700 leading-relaxed">{dashboardData.resumeData.summary}</p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Languages:</span>
                  <span className="text-gray-700 ml-1">{dashboardData.resumeData.skills.languages.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Frontend:</span>
                  <span className="text-gray-700 ml-1">{dashboardData.resumeData.skills.frontend.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Backend:</span>
                  <span className="text-gray-700 ml-1">{dashboardData.resumeData.skills.backend.join(', ')}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Tools & Frameworks:</span>
                  <span className="text-gray-700 ml-1">{dashboardData.resumeData.skills.tools.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Projects</h2>
              <div className="space-y-4">
                {dashboardData.resumeData.projects.map((project, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 text-sm">{project.name}</h3>
                      <a href="#" className="text-blue-600 hover:underline text-xs flex items-center space-x-1">
                        <span>{project.githubLink}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {project.points.slice(0, 3).map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          <span className="leading-relaxed">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
