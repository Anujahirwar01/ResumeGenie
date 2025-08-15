import React, { useState, useEffect } from 'react';
import { ChevronRight, Sparkles, FileText, User, Zap, CheckCircle, ArrowRight, LogOut, Settings, Bell, Upload, Search, Target } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  // Remove default margins and padding from body
  useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, []);

  const demoSteps = [
    { 
      title: "Upload Resume", 
      description: "Upload your resume file",
      icon: FileText,
      color: "text-blue-500"
    },
    { 
      title: "ATS Analysis", 
      description: "AI scans for compatibility",
      icon: Target,
      color: "text-purple-500"
    },
    { 
      title: "Get Results", 
      description: "Receive detailed report",
      icon: CheckCircle,
      color: "text-green-500"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % demoSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const handleLogout = () => {
    logout();
    // Stay on landing page after logout
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF or Word document');
    }
  };

  const handleResumeAnalysis = async () => {
    if (!selectedFile) {
      alert('Please select a resume file');
      return;
    }

    setIsUploading(true);
    
    try {
      // Simulate upload and analysis
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Store analysis data in localStorage for now (later you can send to backend)
      const analysisData = {
        fileName: selectedFile.name,
        atsScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
        uploadDate: new Date().toISOString(),
        suggestions: [
          'Add more relevant keywords for the target role',
          'Improve formatting for better ATS compatibility',
          'Include quantifiable achievements',
          'Optimize section headers'
        ]
      };
      
      localStorage.setItem('latestAnalysis', JSON.stringify(analysisData));
      
      // Navigate to dashboard to show results
      navigate('/dashboard', { state: { newAnalysis: true } });
      
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const features = [
    "ATS compatibility analysis",
    "Keyword optimization suggestions",  
    "Resume formatting improvements",
    "Real-time ATS scoring"
  ];

  return (
  <div className="min-h-screen w-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 m-0 p-0">
      {/* Hero Section */}
      <div className="relative w-screen">
        {/* Background Effects */}
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-75"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-10 flex justify-between items-center p-6 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <Zap className="w-8 h-8 text-cyan-400" />
            <span className="text-white text-xl font-bold">ResumeGenie</span>
          </div>
          
          {isAuthenticated ? (
            // Profile in header for authenticated users
            <div className="flex items-center space-x-4">
              {/* <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-semibold">{user?.name || 'User'}</p>
                  <p className="text-gray-400 text-xs">{user?.email}</p>
                </div>
              </div> */}
              <button 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                Dashboard
              </button>
              {/* <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button> */}
            </div>
          ) : (
            // Login/Signup buttons for non-authenticated users
            <div className="flex space-x-4">
              <Link to="/login">
                <button className="text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors duration-200">
                  Login
                </button>
              </Link>
              <Link to="/register">
                <button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="inline-flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-cyan-400 mr-2" />
                <span className="text-cyan-400 text-sm font-medium">ATS Resume Checker</span>
              </div>
              
              {isAuthenticated ? (
                // Resume Upload Section for Authenticated Users
                <div className="space-y-8">
                  <div>
                    <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                      Ready to optimize your 
                      <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> Resume</span>, {user?.name}?
                    </h1>
                    <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                      Upload your resume and get instant ATS compatibility analysis with personalized suggestions.
                    </p>
                  </div>

                  {/* Resume Upload Card */}
                  <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <div className="flex items-center mb-6">
                      <Target className="w-6 h-6 text-cyan-400 mr-3" />
                      <h3 className="text-2xl font-bold text-white">ATS Resume Scanner</h3>
                    </div>

                    <div className="space-y-6">
                      {/* File Upload */}
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Upload Resume *
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="resume-upload"
                          />
                          <label
                            htmlFor="resume-upload"
                            className="flex items-center justify-center w-full p-6 border-2 border-dashed border-white/30 rounded-xl cursor-pointer hover:border-cyan-400 hover:bg-white/5 transition-all duration-200"
                          >
                            <div className="text-center">
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              {selectedFile ? (
                                <div>
                                  <p className="text-cyan-400 font-medium">{selectedFile.name}</p>
                                  <p className="text-gray-400 text-sm">Click to change file</p>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-white font-medium">Click to upload resume</p>
                                  <p className="text-gray-400 text-sm">PDF, DOC, or DOCX (Max 10MB)</p>
                                </div>
                              )}
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        onClick={handleResumeAnalysis}
                        disabled={!selectedFile || isUploading}
                        className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-2xl hover:shadow-cyan-500/25 flex items-center justify-center"
                      >
                        {isUploading ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                            Analyzing Resume...
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Target className="w-5 h-5 mr-2" />
                            Analyze Resume for ATS
                          </div>
                        )}
                      </button>

                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                          <span>Secure Upload</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                          <span>Instant Analysis</span>
                        </div>
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                          <span>Detailed Report</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // Default Landing Page for Non-Authenticated Users
                <div>
                  <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Check Your Resume's 
                    <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"> ATS Compatibility </span>
                    Instantly
                  </h1>
                  
                  <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                    Get instant feedback on how well your resume performs with Applicant Tracking Systems. Optimize your resume to pass ATS filters and land more interviews.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <button 
                      onClick={handleGetStarted}
                      className="group bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-cyan-500/25"
                    >
                      Get Started
                      <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-300">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Demo Animation */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full p-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-white text-xl font-bold mb-6 text-center">ATS Checker in Action</h3>
                
                <div className="space-y-6">
                  {demoSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = index === currentStep;
                    const isCompleted = index < currentStep;
                    
                    return (
                      <div key={index} className={`flex items-center p-4 rounded-xl transition-all duration-500 ${
                        isActive ? 'bg-white/20 scale-105 shadow-lg' : 
                        isCompleted ? 'bg-green-500/20' : 'bg-white/5'
                      }`}>
                        <div className={`flex items-center justify-center w-12 h-12 rounded-full mr-4 transition-all duration-300 ${
                          isActive ? step.color + ' bg-white/20 scale-110' :
                          isCompleted ? 'text-green-400 bg-green-500/20' : 'text-gray-400 bg-white/10'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                        </div>
                        <div>
                          <h4 className={`font-semibold transition-colors duration-300 ${
                            isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-gray-300'
                          }`}>
                            {step.title}
                          </h4>
                          <p className={`text-sm transition-colors duration-300 ${
                            isActive ? 'text-gray-200' : 'text-gray-400'
                          }`}>
                            {step.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="ml-auto">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-xl p-4 border border-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-cyan-300 text-sm font-medium">Processing...</span>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                  <div className="mt-2 bg-cyan-500/20 rounded-full h-2">
                    <div className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                         style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: "10K+", label: "Resumes Analyzed" },
              { number: "95%", label: "ATS Pass Rate" },
              { number: "3x", label: "More Interviews" }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                <div className="text-3xl md:text-4xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;