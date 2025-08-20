import React, { useState, useContext } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ResumeUpload = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  
  // Progress tracking states
  const [progress, setProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  
  // Form data for analysis parameters
  const [jobIndustry, setJobIndustry] = useState('technology');
  const [jobLevel, setJobLevel] = useState('mid');
  const [jobTitle, setJobTitle] = useState('');
  const [customJobTitle, setCustomJobTitle] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const { user } = useAuth();

  const industries = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'sales', label: 'Sales' },
    { value: 'education', label: 'Education' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
    { value: 'operations', label: 'Operations' },
    { value: 'management', label: 'Management' },
    { value: 'other', label: 'Other' }
  ];

  const jobLevels = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'mid', label: 'Mid Level' },
    { value: 'senior', label: 'Senior Level' },
    { value: 'executive', label: 'Executive' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    setSuccess('');
    setAnalysisData(null);

    // Validate file
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) { // 5MB
      setError('File size must be less than 5MB');
      return;
    }

    setFile(selectedFile);
  };

  // Job title suggestions based on industry
  const getJobTitleSuggestions = (industry) => {
    const titlesByIndustry = {
      technology: [
        'Software Engineer',
        'Frontend Developer',
        'Backend Developer',
        'Full Stack Developer',
        'DevOps Engineer',
        'Data Scientist',
        'Product Manager',
        'UI/UX Designer',
        'Mobile Developer',
        'Cloud Engineer',
        'Machine Learning Engineer',
        'Cybersecurity Analyst'
      ],
      finance: [
        'Financial Analyst',
        'Investment Banker',
        'Accountant',
        'Risk Manager',
        'Portfolio Manager',
        'Financial Advisor',
        'Credit Analyst',
        'Compliance Officer',
        'Treasury Analyst',
        'Auditor',
        'Financial Planner',
        'Quantitative Analyst'
      ],
      healthcare: [
        'Registered Nurse',
        'Medical Assistant',
        'Healthcare Administrator',
        'Physical Therapist',
        'Medical Technologist',
        'Health Information Manager',
        'Clinical Research Coordinator',
        'Healthcare Data Analyst',
        'Medical Coder',
        'Pharmacist',
        'Radiologic Technologist',
        'Healthcare Consultant'
      ],
      marketing: [
        'Digital Marketing Manager',
        'Content Marketing Specialist',
        'SEO Specialist',
        'Social Media Manager',
        'Marketing Analyst',
        'Brand Manager',
        'Email Marketing Specialist',
        'Marketing Coordinator',
        'Growth Marketing Manager',
        'PPC Specialist',
        'Marketing Director',
        'Campaign Manager'
      ],
      sales: [
        'Sales Representative',
        'Account Manager',
        'Sales Manager',
        'Business Development Representative',
        'Inside Sales Representative',
        'Sales Director',
        'Customer Success Manager',
        'Territory Sales Manager',
        'Key Account Manager',
        'Sales Engineer',
        'Regional Sales Manager',
        'Sales Coordinator'
      ],
      education: [
        'Teacher',
        'Principal',
        'Academic Advisor',
        'Curriculum Developer',
        'Instructional Designer',
        'Education Administrator',
        'School Counselor',
        'Librarian',
        'Special Education Teacher',
        'Training Coordinator',
        'Educational Consultant',
        'Research Assistant'
      ],
      engineering: [
        'Mechanical Engineer',
        'Civil Engineer',
        'Electrical Engineer',
        'Chemical Engineer',
        'Project Engineer',
        'Design Engineer',
        'Process Engineer',
        'Quality Engineer',
        'Manufacturing Engineer',
        'Systems Engineer',
        'Environmental Engineer',
        'Structural Engineer'
      ],
      design: [
        'Graphic Designer',
        'UX Designer',
        'UI Designer',
        'Web Designer',
        'Product Designer',
        'Creative Director',
        'Visual Designer',
        'Motion Graphics Designer',
        'Brand Designer',
        'Interior Designer',
        'Industrial Designer',
        'Design Researcher'
      ],
      operations: [
        'Operations Manager',
        'Supply Chain Manager',
        'Logistics Coordinator',
        'Process Improvement Specialist',
        'Operations Analyst',
        'Warehouse Manager',
        'Quality Assurance Manager',
        'Operations Director',
        'Production Manager',
        'Inventory Manager',
        'Facilities Manager',
        'Operations Coordinator'
      ],
      management: [
        'Project Manager',
        'General Manager',
        'Operations Manager',
        'Team Lead',
        'Department Manager',
        'Program Manager',
        'Vice President',
        'Director',
        'Executive Assistant',
        'Chief Executive Officer',
        'Chief Operating Officer',
        'Regional Manager'
      ],
      other: [
        'Administrative Assistant',
        'Customer Service Representative',
        'Human Resources Specialist',
        'Legal Assistant',
        'Consultant',
        'Analyst',
        'Coordinator',
        'Specialist',
        'Manager',
        'Associate',
        'Executive',
        'Director'
      ]
    };

    return titlesByIndustry[industry] || titlesByIndustry.other;
  };

  const jobTitleSuggestions = getJobTitleSuggestions(jobIndustry);

  // Handle industry change and reset job title
  const handleIndustryChange = (newIndustry) => {
    setJobIndustry(newIndustry);
    setJobTitle(''); // Reset job title when industry changes
    setCustomJobTitle(''); // Reset custom job title
    setShowCustomInput(false); // Hide custom input
  };

  // Handle job title change
  const handleJobTitleChange = (value) => {
    if (value === 'custom') {
      setShowCustomInput(true);
      setJobTitle('');
    } else {
      setShowCustomInput(false);
      setJobTitle(value);
      setCustomJobTitle('');
    }
  };

  // Handle custom job title change
  const handleCustomJobTitleChange = (value) => {
    setCustomJobTitle(value);
    setJobTitle(value);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    if (!jobTitle.trim()) {
      setError('Please enter the job title you\'re applying for');
      return;
    }

    setUploading(true);
    setError('');
    setSuccess('');
    setProgress(0);
    setCurrentStage('starting');
    setProgressMessage('Preparing file upload...');

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobIndustry', jobIndustry);
      formData.append('jobLevel', jobLevel);
      formData.append('jobTitle', jobTitle);

      const token = localStorage.getItem('token');

      // Use fetch for Server-Sent Events
      const response = await fetch('http://localhost:5000/api/analysis/upload-with-progress', {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              // Update progress states
              setProgress(data.progress || 0);
              setCurrentStage(data.stage || '');
              setProgressMessage(data.message || '');

              // Handle completion
              if (data.stage === 'complete' && data.result) {
                setSuccess('Resume analyzed successfully!');
                setAnalysisData(data.result.data);
                
                // Notify parent component
                if (onAnalysisComplete) {
                  onAnalysisComplete(data.result.data);
                }

                // Reset form
                setFile(null);
                setJobTitle('');
                setProgress(100);
                setProgressMessage('Analysis complete!');
              }

              // Handle errors
              if (data.error || data.stage === 'error') {
                setError(data.message || 'Processing failed');
                setProgress(0);
                break;
              }

            } catch (parseError) {
              console.warn('Failed to parse progress data:', parseError);
            }
          }
        }
      }

    } catch (error) {
      console.error('Upload error:', error);
      setError(
        error.message || 'Failed to analyze resume. Please try again.'
      );
      setProgress(0);
      setProgressMessage('');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setError('');
    setSuccess('');
    setAnalysisData(null);
    setJobTitle('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">ATS Resume Analysis</h2>
      
      {/* Analysis Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Industry
          </label>
          <div className="relative">
            <select
              value={jobIndustry}
              onChange={(e) => handleIndustryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
            >
              {industries.map(industry => (
                <option key={industry.value} value={industry.value}>
                  {industry.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Level
          </label>
          <div className="relative">
            <select
              value={jobLevel}
              onChange={(e) => setJobLevel(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none pr-10"
            >
              {jobLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <div className="relative">
            <select
              value={showCustomInput ? 'custom' : jobTitle}
              onChange={(e) => handleJobTitleChange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors appearance-none pr-10 ${
                jobTitle.trim() 
                  ? 'border-gray-300 focus:ring-blue-500' 
                  : 'border-red-300 focus:ring-red-500 bg-red-50'
              }`}
              required
            >
              <option value="">Select a job title...</option>
              {jobTitleSuggestions.map((title, index) => (
                <option key={index} value={title}>
                  {title}
                </option>
              ))}
              <option value="custom">Other (enter custom title)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          
          {showCustomInput && (
            <div className="mt-2">
              <input
                type="text"
                value={customJobTitle}
                onChange={(e) => handleCustomJobTitleChange(e.target.value)}
                placeholder="Enter your job title..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>
          )}
          
          {!jobTitle.trim() && (
            <p className="text-xs text-red-600 mt-1">
              Job title is required to analyze your resume effectively
            </p>
          )}
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center">
          <Upload className="w-12 h-12 text-gray-400 mb-4" />
          
          {file ? (
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">{file.name}</span>
              <button
                onClick={resetForm}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Remove
              </button>
            </div>
          ) : (
            <>
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop your resume here or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">
                Supports PDF, DOC, DOCX, and TXT files (max 5MB)
              </p>
            </>
          )}

          <input
            type="file"
            onChange={(e) => e.target.files[0] && handleFileSelect(e.target.files[0])}
            accept=".pdf,.doc,.docx,.txt"
            className="hidden"
            id="file-upload"
          />
          
          {!file && (
            <label
              htmlFor="file-upload"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Choose File
            </label>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
          <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-700">{success}</span>
        </div>
      )}

      {/* Progress Indicator */}
      {uploading && (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Loader className="w-5 h-5 text-blue-600 mr-2 animate-spin" />
              <span className="text-sm font-medium text-blue-800">
                {progressMessage || 'Processing...'}
              </span>
            </div>
            <span className="text-sm font-medium text-blue-600">
              {progress}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          {/* Stage Indicator with Enhanced Messages */}
          <div className="mt-4 space-y-3">
            {/* Please Wait Stage */}
            <div className={`flex items-center space-x-3 ${
              currentStage === 'starting' || currentStage === 'validating' || !currentStage ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {currentStage === 'starting' || currentStage === 'validating' || !currentStage ? 
                <Loader className="w-5 h-5 animate-spin" /> : 
                <CheckCircle className="w-5 h-5" />
              }
              <span className="text-sm font-medium">Please wait...</span>
            </div>

            {/* Loading Resume Stage */}
            <div className={`flex items-center space-x-3 ${
              currentStage === 'reading' ? 'text-blue-600' : currentStage === 'starting' || currentStage === 'validating' || !currentStage ? 'text-gray-400' : 'text-green-600'
            }`}>
              {currentStage === 'reading' ? 
                <Loader className="w-5 h-5 animate-spin" /> : 
                (currentStage === 'starting' || currentStage === 'validating' || !currentStage ? 
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div> :
                  <CheckCircle className="w-5 h-5" />)
              }
              <span className="text-sm font-medium">Loading your resume...</span>
            </div>

            {/* Parsing Resume Stage */}
            <div className={`flex items-center space-x-3 ${
              currentStage === 'parsing' || currentStage === 'extracting' ? 'text-blue-600' : 
              (currentStage === 'processing' || currentStage === 'analyzing' || currentStage === 'structuring' || currentStage === 'finalizing' || currentStage === 'complete') ? 'text-green-600' : 'text-gray-400'
            }`}>
              {currentStage === 'parsing' || currentStage === 'extracting' ? 
                <Loader className="w-5 h-5 animate-spin" /> : 
                ((currentStage === 'processing' || currentStage === 'analyzing' || currentStage === 'structuring' || currentStage === 'finalizing' || currentStage === 'complete') ? 
                  <CheckCircle className="w-5 h-5" /> :
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>)
              }
              <span className="text-sm font-medium">Parsing your resume...</span>
            </div>

            {/* Identifying Core Sections Stage */}
            <div className={`flex items-center space-x-3 ${
              currentStage === 'analyzing' || currentStage === 'structuring' ? 'text-blue-600' : 
              (currentStage === 'finalizing' || currentStage === 'complete') ? 'text-green-600' : 'text-gray-400'
            }`}>
              {currentStage === 'analyzing' || currentStage === 'structuring' ? 
                <Loader className="w-5 h-5 animate-spin" /> : 
                ((currentStage === 'finalizing' || currentStage === 'complete') ? 
                  <CheckCircle className="w-5 h-5" /> :
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>)
              }
              <span className="text-sm font-medium">Identifying core sections...</span>
            </div>

            {/* Additional stages can be added here */}
            {(currentStage === 'finalizing' || currentStage === 'complete') && (
              <div className={`flex items-center space-x-3 ${
                currentStage === 'complete' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {currentStage === 'complete' ? 
                  <CheckCircle className="w-5 h-5" /> : 
                  <Loader className="w-5 h-5 animate-spin" />
                }
                <span className="text-sm font-medium">
                  {currentStage === 'complete' ? 'Analysis complete!' : 'Finalizing analysis...'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {file && (
        <div className="mt-6">
          {!jobTitle.trim() && (
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="text-sm text-amber-700 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Please enter the job title you're applying for to enable analysis
              </p>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={uploading || !jobTitle.trim()}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            title={!jobTitle.trim() ? 'Please enter a job title first' : 'Analyze your resume'}
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Resume...
              </>
            ) : (
              'Analyze Resume'
            )}
          </button>
        </div>
      )}

      {/* Quick Analysis Preview */}
      {analysisData && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Analysis Complete!</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                analysisData.overallScore >= 80 ? 'text-green-600' :
                analysisData.overallScore >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysisData.overallScore}%
              </div>
              <div className="text-sm text-gray-600">Overall Score</div>
            </div>
            <div className="text-center">
              <div className={`text-xl font-bold ${
                analysisData.grade === 'A' ? 'text-green-600' :
                analysisData.grade === 'B' ? 'text-blue-600' :
                analysisData.grade === 'C' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {analysisData.grade}
              </div>
              <div className="text-sm text-gray-600">Grade</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-medium ${
                analysisData.status === 'ATS-Friendly' ? 'text-green-600' : 'text-red-600'
              }`}>
                {analysisData.status}
              </div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">
                {analysisData.suggestions?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Suggestions</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
