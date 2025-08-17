import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnalysis } from '../context/AnalysisContext';
import ExpertAnalysisResults from '../components/ExpertAnalysisResults';
import ResumeUpload from '../components/ResumeUpload';
import API from '../services/api.js';
import {
  Home,
  Plus,
  BookmarkCheck,
  User,
  LogOut,
  ChevronDown,
  Target,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
  ChevronRight,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Award,
  UserCircle,
  Settings,
  Activity
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { currentAnalysis, setCurrentAnalysis } = useAnalysis();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedAnalysisData, setSelectedAnalysisData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState({
    totalAnalyses: 0,
    averageScore: 0,
    thisWeek: 0,
    improvementRate: 0,
    previousAverageScore: 0,
    scoreChange: 0,
    lastMonthAnalyses: 0,
    analysisGrowth: 0,
    topScore: 0,
    lowestScore: 0,
    trendDirection: 'up'
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);
  
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const fetchDashboardStats = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingStats(true);
      const token = localStorage.getItem('token');
      const response = await API.get('/api/analysis/stats/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Backend returns { success: true, data: { stats: {...}, recentActivities: [...] } }
      const responseData = response.data?.data || {};
      const stats = responseData.stats || {};
      
      // Transform backend stats structure to frontend expectations
      const enhanced = {
        totalAnalyses: parseInt(stats.resumesAnalyzed?.value || '0'),
        averageScore: parseInt(stats.averageScore?.value?.replace('%', '') || '0'),
        thisWeek: 0, // Calculate from recent activities
        improvementRate: 0,
        previousAverageScore: 0,
        scoreChange: parseInt(stats.averageScore?.change?.replace('%', '') || '0'),
        lastMonthAnalyses: 0,
        analysisGrowth: parseInt(stats.resumesAnalyzed?.change || '0'),
        topScore: 0,
        lowestScore: 0,
        trendDirection: parseInt(stats.averageScore?.change?.replace('%', '') || '0') > 0 ? 'up' : 
                       parseInt(stats.averageScore?.change?.replace('%', '') || '0') < 0 ? 'down' : 'stable'
      };
      
      setDashboardStats(enhanced);
      setRecentActivities(responseData.recentActivities || []);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set empty array on error to prevent map errors
      setRecentActivities([]);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAnalysisHistory = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem('token');
      const response = await API.get('/api/analysis/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Backend returns { success: true, data: { analyses: [...] } }
      const analysesData = response.data?.data?.analyses || response.data || [];
      const historyData = Array.isArray(analysesData) ? analysesData : [];
      setAnalysisHistory(historyData);
    } catch (error) {
      console.error('Error fetching analysis history:', error);
      // Set empty array on error to prevent map errors
      setAnalysisHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const fetchAnalysisDetails = async (analysisId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await API.get(`/api/analysis/${analysisId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedAnalysisData(response.data);
      setActiveTab('analysis');
    } catch (error) {
      console.error('Error fetching analysis details:', error);
    }
  };

  const handleAnalysisClick = (analysis) => {
    fetchAnalysisDetails(analysis._id);
  };

  // Fetch history when reports tab is activated or when a new analysis is completed
  useEffect(() => {
    if (activeTab === 'reports' && isAuthenticated) {
      fetchAnalysisHistory();
    }
  }, [activeTab, currentAnalysis, isAuthenticated]);

  // Fetch dashboard stats when component mounts and user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setShowProfileDropdown(false);
  };

  const sidebarItems = [
    { id: 'home', label: 'Overview', icon: Home },
    { id: 'upload', label: 'New Analysis', icon: Plus },
    { id: 'reports', label: 'My Reports', icon: BookmarkCheck }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex">
      {/* Enhanced Professional Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 relative">
        {/* Logo Section with gradient */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">ResumeGenie</h1>
              <p className="text-sm text-blue-100">ATS Analysis Pro</p>
            </div>
          </div>
        </div>

        {/* Navigation with enhanced styling */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 transform hover:scale-105 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <div className="ml-auto">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Enhanced User Profile Section */}
        <div className="absolute bottom-0 left-0 w-64 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          {/* User Stats Summary */}
          <div className="p-3 border-b border-gray-100">
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-bold text-blue-600">{dashboardStats.totalAnalyses}</p>
                <p className="text-xs text-gray-600">Resumes</p>
              </div>
              <div className="bg-white rounded-lg p-2">
                <p className="text-lg font-bold text-green-600">{dashboardStats.averageScore}%</p>
                <p className="text-xs text-gray-600">Avg Score</p>
              </div>
            </div>
          </div>
          
          {/* Profile Section */}
          <div className="p-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl hover:bg-white/50 transition-all duration-200 border border-white/20"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <UserCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3 text-yellow-500" />
                    <p className="text-xs text-blue-600 font-medium">Premium</p>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  showProfileDropdown ? 'rotate-180' : ''
                }`} />
              </button>
              
              {showProfileDropdown && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => setShowProfileDropdown(false)}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                {activeTab === 'home' && '📊 Dashboard Overview'}
                {activeTab === 'upload' && '🚀 New Analysis'}
                {activeTab === 'reports' && '📋 My Reports'}
                {activeTab === 'analysis' && '🎯 Analysis Results'}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                {activeTab === 'home' && 'Track your resume optimization journey with detailed analytics'}
                {activeTab === 'upload' && 'Upload your resume for comprehensive ATS analysis'}
                {activeTab === 'reports' && 'View your analysis history and track improvements'}
                {activeTab === 'analysis' && 'Detailed analysis results with actionable recommendations'}
              </p>
            </div>
            
            {activeTab === 'home' && (
              <button
                onClick={() => setActiveTab('upload')}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">New Analysis</span>
              </button>
            )}
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Dashboard Overview */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Analyses with Growth */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Total Resumes</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {loadingStats ? '...' : dashboardStats.totalAnalyses}
                      </p>
                      <div className="flex items-center mt-2">
                        {dashboardStats.analysisGrowth > 0 ? (
                          <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : dashboardStats.analysisGrowth < 0 ? (
                          <ArrowDown className="w-4 h-4 text-red-500 mr-1" />
                        ) : null}
                        <p className={`text-xs font-medium ${
                          dashboardStats.analysisGrowth > 0 ? 'text-green-600' : 
                          dashboardStats.analysisGrowth < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {dashboardStats.analysisGrowth !== 0 ? 
                            `${dashboardStats.analysisGrowth > 0 ? '+' : ''}${dashboardStats.analysisGrowth} this month` :
                            'Track your progress'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                {/* Average Score with Trend */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Average Score</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {loadingStats ? '...' : `${dashboardStats.averageScore}%`}
                      </p>
                      <div className="flex items-center mt-2">
                        {dashboardStats.scoreChange > 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        ) : dashboardStats.scoreChange < 0 ? (
                          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                        ) : null}
                        <p className={`text-xs font-medium ${
                          dashboardStats.scoreChange > 0 ? 'text-green-600' : 
                          dashboardStats.scoreChange < 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {dashboardStats.scoreChange !== 0 ? 
                            `${dashboardStats.scoreChange > 0 ? '+' : ''}${dashboardStats.scoreChange}% improvement` :
                            'Keep improving!'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                {/* This Week */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">This Week</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                        {loadingStats ? '...' : dashboardStats.thisWeek}
                      </p>
                      <p className="text-xs text-purple-600 font-medium mt-2">
                        {dashboardStats.thisWeek > 0 ? '🔥 Active week!' : '📝 Ready to upload?'}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Calendar className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>

                {/* Performance Grade */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">Performance</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {loadingStats ? '...' : 
                          dashboardStats.averageScore >= 90 ? 'A+' :
                          dashboardStats.averageScore >= 80 ? 'A' :
                          dashboardStats.averageScore >= 70 ? 'B+' : 'B'
                        }
                      </p>
                      <div className="flex items-center mt-2">
                        <Award className="w-4 h-4 text-orange-500 mr-1" />
                        <p className="text-xs text-orange-600 font-medium">
                          {dashboardStats.trendDirection === 'up' ? 'Improving' : 'Keep pushing!'}
                        </p>
                      </div>
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <BarChart3 className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                      📊 Recent Analysis History
                      <span className="ml-3 px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {recentActivities.length} resumes
                      </span>
                    </h3>
                    {recentActivities.length > 0 && (
                      <button
                        onClick={() => setActiveTab('reports')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View All →
                      </button>
                    )}
                  </div>
                </div>
                <div className="p-6">
                  {recentActivities.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-blue-600" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Start Your Journey</h4>
                      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Upload your first resume to begin tracking your ATS optimization progress.
                      </p>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg font-medium"
                      >
                        🚀 Upload First Resume
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {(recentActivities && Array.isArray(recentActivities) ? recentActivities : []).slice(0, 5).map((activity, index) => (
                        <div 
                          key={index} 
                          className="group flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200" 
                          onClick={() => handleAnalysisClick(activity)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                              <FileText className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-blue-900">
                                {activity.filename}
                              </p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                {new Date(activity.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                                {activity.overallScore}%
                              </p>
                              <p className="text-sm text-gray-500 font-medium">ATS Score</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-blue-600 p-8 text-center">
                  <h2 className="text-3xl font-bold text-white mb-3">🚀 Upload Your Resume</h2>
                  <p className="text-green-100 text-lg">
                    Get instant ATS analysis with personalized recommendations
                  </p>
                </div>
                <div className="p-8">
                  <ResumeUpload onAnalysisComplete={(analysis) => {
                    setCurrentAnalysis(analysis);
                    setActiveTab('analysis');
                  }} />
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-blue-50">
                  <h3 className="text-2xl font-bold text-gray-900">📊 Analysis History</h3>
                  <p className="text-gray-600 mt-1">Track your resume improvement journey</p>
                </div>
                <div className="p-6">
                  {loadingHistory ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-500">Loading your reports...</p>
                    </div>
                  ) : (!analysisHistory || !Array.isArray(analysisHistory) || analysisHistory.length === 0) ? (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h4 className="text-xl font-semibold text-gray-600 mb-2">No Reports Yet</h4>
                      <p className="text-gray-500 mb-6">Upload a resume to start building your analysis history.</p>
                      <button
                        onClick={() => setActiveTab('upload')}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Upload Resume
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {analysisHistory.map((analysis, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleAnalysisClick(analysis)}
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{analysis.filename}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(analysis.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-lg font-semibold text-gray-900">{analysis.overallScore}%</p>
                              <p className="text-sm text-gray-500">ATS Score</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analysis Results Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {selectedAnalysisData ? (
                <ExpertAnalysisResults 
                  analysisData={selectedAnalysisData}
                  onBack={() => setActiveTab('reports')}
                />
              ) : currentAnalysis ? (
                <ExpertAnalysisResults 
                  analysisData={currentAnalysis}
                  onBack={() => setActiveTab('upload')}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Analysis Selected</h3>
                  <p className="text-gray-500 mb-6">Upload a resume or select an analysis to view results.</p>
                  <div className="space-x-4">
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Upload Resume
                    </button>
                    <button
                      onClick={() => setActiveTab('reports')}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      View Reports
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
