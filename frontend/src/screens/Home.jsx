import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  Target, 
  Briefcase, 
  BookmarkCheck, 
  Settings, 
  Home,
  Bell,
  User,
  Search,
  TrendingUp,
  Clock,
  Star,
  ChevronRight,
  BarChart3,
  Users,
  Award,
  LogOut,
  ChevronDown,
  UserCog,
  FileQuestion,
  Upload,
  Activity,
  Zap,
  Calendar,
  Eye,
  Download,
  Filter,
  MoreHorizontal,
  CheckCircle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import ExpertAnalysisResults from '../components/ExpertAnalysisResults_enhanced';
import axios from 'axios';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [currentResumeText, setCurrentResumeText] = useState('');
  const [showAnalysisResults, setShowAnalysisResults] = useState(false);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Fetch analysis history
  const fetchAnalysisHistory = async () => {
    try {
      setLoadingHistory(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/analysis/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAnalysisHistory(response.data.data.analyses);
      }
    } catch (error) {
      console.error('Error fetching analysis history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleAnalysisComplete = (analysisData) => {
      setCurrentAnalysis(analysisData);
      // Store the extracted text if available
      if (analysisData.extractedText) {
        setCurrentResumeText(analysisData.extractedText);
      }
      setShowAnalysisResults(true);
      setActiveTab('analysis');
    };

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

  // Fetch history when reports tab is activated or when a new analysis is completed
  useEffect(() => {
    if (activeTab === 'reports') {
      fetchAnalysisHistory();
    }
  }, [activeTab, currentAnalysis]); // Add currentAnalysis as dependency to refresh history when new analysis is added

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
    setShowProfileDropdown(false);
  };

  const handleAccountSettings = () => {
    setShowProfileDropdown(false);
    // You can navigate to settings page or open a modal
    setActiveTab('settings');
  };

  const handleTermsOfService = () => {
    setShowProfileDropdown(false);
    // You can navigate to terms page or open a modal
    console.log('Terms of Service clicked');
  };

  const sidebarItems = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'upload', label: 'Upload Resume', icon: FileText },
    { id: 'analysis', label: 'ATS Analysis', icon: Target },
    { id: 'reports', label: 'ATS Reports', icon: BookmarkCheck }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'upload',
      title: 'Resume uploaded successfully',
      description: 'Updated_Resume_2024.pdf - ATS Score: 87%',
      time: '2 hours ago',
      icon: FileText,
      status: 'success'
    },
    {
      id: 2,
      type: 'analysis',
      title: 'ATS analysis completed',
      description: 'Resume compatibility check finished',
      time: '4 hours ago',
      icon: Target,
      status: 'success'
    },
    {
      id: 3,
      type: 'report',
      title: 'ATS report generated',
      description: 'Detailed compatibility report with suggestions',
      time: '1 day ago',
      icon: BarChart3,
      status: 'info'
    },
    {
      id: 4,
      type: 'upload',
      title: 'Resume updated',
      description: 'Resume_Final_v2.pdf - ATS Score: 92%',
      time: '2 days ago',
      icon: FileText,
      status: 'success'
    }
  ];

  const stats = [
    {
      title: 'Resumes Analyzed',
      value: '8',
      change: '+2',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Average ATS Score',
      value: '87%',
      change: '+5%',
      icon: Target,
      color: 'bg-green-500'
    },
    {
      title: 'Keywords Found',
      value: '156',
      change: '+23',
      icon: Search,
      color: 'bg-purple-500'
    },
    {
      title: 'Reports Generated',
      value: '12',
      change: '+3',
      icon: BookmarkCheck,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
      {/* Sidebar */}
      <div className="w-72 bg-white/80 backdrop-blur-xl shadow-2xl border-r border-white/20">
        {/* Logo Section */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Zap className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ResumeGenie</h1>
              <p className="text-blue-100 text-sm">ATS Resume Checker</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-4 px-4 py-3.5 rounded-xl text-left transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700 hover:transform hover:scale-102'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-blue-100'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold">{item.label}</span>
                {isActive && (
                  <div className="ml-auto">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Stats Card */}
        <div className="mx-6 mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">ATS Pro</p>
              <p className="text-xs text-blue-600">Resume Analyzer</p>
            </div>
          </div>
          <div className="text-xs text-blue-700">
            <p>✓ Unlimited ATS scans</p>
            <p>✓ Detailed reports</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Header */}
        <header className="bg-white/70 backdrop-blur-xl shadow-sm border-b border-white/20 px-8 py-6 relative z-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Dashboard
                </h2>
                <div className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-lg">Welcome back, <span className="font-semibold text-gray-900">{user?.name || 'User'}</span>! Check your resume's ATS compatibility.</p>
            </div>
            <div className="flex items-center space-x-6">
              {/* Enhanced Search */}
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search resumes, keywords..."
                  className="pl-12 pr-6 py-3 w-80 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Filter className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              
              {/* Notifications */}
              <button className="relative p-3 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200">
                <Bell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </span>
              </button>
              
              {/* Profile Dropdown */}
              <div className="relative z-[10000]" ref={dropdownRef}>
                <button 
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-3 p-3 text-gray-600 hover:text-gray-900 hover:bg-white/60 rounded-xl transition-all duration-200"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-3 w-72 bg-white backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 py-2 z-[10001]">
                    {/* User Info */}
                    <div className="px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <div className="flex items-center mt-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs text-green-600 font-medium">Premium Active</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <button
                        onClick={handleAccountSettings}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <UserCog className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium">Account Settings</span>
                      </button>
                      
                      <button
                        onClick={handleTermsOfService}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-left text-gray-700 hover:bg-blue-50 transition-colors duration-200"
                      >
                        <FileQuestion className="w-5 h-5 text-purple-600" />
                        <span className="text-sm font-medium">Terms of Service</span>
                      </button>
                      
                      <hr className="my-2 border-gray-100" />
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8 overflow-y-auto h-full">
          {activeTab === 'home' && (
            <>
              {/* Enhanced Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="group bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20 hover:shadow-2xl hover:transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 ${stat.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="flex items-center space-x-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>{stat.change}</span>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${stat.color.replace('bg-', 'bg-gradient-to-r from-').replace('-500', '-400 to-' + stat.color.split('-')[1] + '-600')}`} 
                         style={{ width: `${Math.floor(Math.random() * 40) + 60}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Enhanced Recent Activity */}
            <div className="xl:col-span-2 bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Recent Activity</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                      <Filter className="w-4 h-4" />
                    </button>
                    <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                      View All
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                      <div key={activity.id} className="group flex items-start space-x-4 p-5 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 cursor-pointer">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          activity.status === 'success' ? 'bg-green-100 text-green-600 group-hover:bg-green-500 group-hover:text-white' : 'bg-blue-100 text-blue-600 group-hover:bg-blue-500 group-hover:text-white'
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-800">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center mt-3 text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {activity.time}
                            <div className="ml-3 flex items-center space-x-1">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              <span className="text-green-600 font-medium">Completed</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-all duration-200">
                            <Eye className="w-4 h-4" />
                          </button>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Activity Summary */}
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">This Week's Progress</span>
                    </div>
                    <span className="text-xs text-gray-500">4 activities completed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Quick Actions & Performance */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 group border border-gray-100 hover:border-blue-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Upload Resume</span>
                        <p className="text-xs text-gray-500">Check ATS compatibility</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('analysis')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl transition-all duration-300 group border border-gray-100 hover:border-green-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 text-green-600 rounded-xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                        <Target className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">View ATS Analysis</span>
                        <p className="text-xs text-gray-500">Check scores & suggestions</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('reports')}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 rounded-xl transition-all duration-300 group border border-gray-100 hover:border-orange-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-colors">
                        <BookmarkCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-900">ATS Reports</span>
                        <p className="text-xs text-gray-500">View saved reports</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all duration-200" />
                  </button>
                </div>
              </div>

              {/* Enhanced Performance Insights */}
              <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">ATS Performance</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-5 h-5 text-yellow-300" />
                      <Star className="w-5 h-5 text-yellow-300" />
                      <Star className="w-5 h-5 text-yellow-300" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm">ATS Compatibility</span>
                        <span className="text-white font-bold">87%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div className="bg-gradient-to-r from-yellow-300 to-green-300 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                    
                    <p className="text-blue-100 text-sm leading-relaxed">
                      🚀 Your resume ATS score improved by <span className="font-bold text-yellow-300">15%</span> this week!
                    </p>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Target className="w-4 h-4" />
                        <span>87% ATS Score</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>8 Keywords</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full mt-6 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                    View Detailed ATS Report
                  </button>
                </div>
              </div>

              {/* ATS Tips Card */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl shadow-lg border border-green-200/50 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">ATS Improvement Tip</h3>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  Add 2-3 more industry-specific keywords to increase your ATS compatibility score by up to 15%.
                </p>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold">
                  Optimize Keywords →
                </button>
              </div>
            </div>
          </div>
          </>
          )}

          {/* Upload Resume Tab */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <ResumeUpload onAnalysisComplete={(data) => {
                setCurrentAnalysis(data);
                setShowAnalysisResults(true);
                setActiveTab('analysis');
              }} />
            </div>
          )}

          {/* ATS Analysis Tab */}
          {activeTab === 'analysis' && (
            <div className="space-y-6">
              {currentAnalysis ? (
                <ExpertAnalysisResults 
                  analysisData={currentAnalysis} 
                  resumeText={currentResumeText} 
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Analysis Available</h3>
                  <p className="text-gray-500 mb-6">Upload a resume first to see detailed ATS analysis results.</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Analysis History</h2>
                  <button
                    onClick={fetchAnalysisHistory}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                    Refresh
                  </button>
                </div>

                {loadingHistory ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading analysis history...</p>
                  </div>
                ) : analysisHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No Analysis History</h3>
                    <p className="text-gray-500 mb-4">Upload and analyze your first resume to see history here.</p>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Upload Resume
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analysisHistory.map((analysis) => (
                      <div key={analysis._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FileText className="w-5 h-5 text-blue-600" />
                              <h3 className="font-semibold text-gray-900">{analysis.fileName}</h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                analysis.grade === 'A' ? 'bg-green-100 text-green-800' :
                                analysis.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                analysis.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                Grade {analysis.grade}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <p className="text-sm text-gray-500">Job Title</p>
                                <p className="font-medium text-gray-900">{analysis.jobTitle || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Industry</p>
                                <p className="font-medium text-gray-900">{analysis.jobIndustry || 'Not specified'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Analyzed</p>
                                <p className="font-medium text-gray-900">
                                  {new Date(analysis.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                              <div className="text-center">
                                <div className="text-lg font-bold text-gray-900">{analysis.overallScore}%</div>
                                <div className="text-xs text-gray-500">Overall</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-blue-600">{analysis.categoryScores.keywords}%</div>
                                <div className="text-xs text-gray-500">Keywords</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-green-600">{analysis.categoryScores.formatting}%</div>
                                <div className="text-xs text-gray-500">Format</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-purple-600">{analysis.categoryScores.content}%</div>
                                <div className="text-xs text-gray-500">Content</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-orange-600">{analysis.categoryScores.structure}%</div>
                                <div className="text-xs text-gray-500">Structure</div>
                              </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  analysis.overallScore >= 80 ? 'bg-green-600' :
                                  analysis.overallScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                                }`}
                                style={{ width: `${analysis.overallScore}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">Settings</h3>
                  <p className="text-gray-500">Manage your account settings and preferences.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;