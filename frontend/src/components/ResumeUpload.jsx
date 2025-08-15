import React, { useState, useContext } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ResumeUpload = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [analysisData, setAnalysisData] = useState(null);
  
  // Form data for analysis parameters
  const [jobIndustry, setJobIndustry] = useState('technology');
  const [jobLevel, setJobLevel] = useState('mid');
  const [jobTitle, setJobTitle] = useState('');

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

    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('jobIndustry', jobIndustry);
      formData.append('jobLevel', jobLevel);
      formData.append('jobTitle', jobTitle);

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/analysis/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setSuccess('Resume analyzed successfully!');
        setAnalysisData(response.data.data);
        
        // Notify parent component
        if (onAnalysisComplete) {
          onAnalysisComplete(response.data.data);
        }

        // Reset form
        setFile(null);
        setJobTitle('');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError(
        error.response?.data?.message || 
        'Failed to analyze resume. Please try again.'
      );
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
          <select
            value={jobIndustry}
            onChange={(e) => setJobIndustry(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {industries.map(industry => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Level
          </label>
          <select
            value={jobLevel}
            onChange={(e) => setJobLevel(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {jobLevels.map(level => (
              <option key={level.value} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Title *
          </label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g., Software Engineer"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-colors ${
              jobTitle.trim() 
                ? 'border-gray-300 focus:ring-blue-500' 
                : 'border-red-300 focus:ring-red-500 bg-red-50'
            }`}
            required
          />
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
