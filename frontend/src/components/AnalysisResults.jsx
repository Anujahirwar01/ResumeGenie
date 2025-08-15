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
  Award
} from 'lucide-react';

const AnalysisResults = ({ analysisData }) => {
  if (!analysisData) {
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No analysis data available</p>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const ScoreCard = ({ title, score, icon: Icon, description }) => (
    <div className={`p-4 rounded-lg border ${getScoreBgColor(score)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className="w-5 h-5 mr-2 text-gray-600" />
          <h3 className="font-medium text-gray-800">{title}</h3>
        </div>
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
          {Math.round(score)}%
        </span>
      </div>
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}
    </div>
  );

  const SuggestionItem = ({ suggestion }) => (
    <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <div className={`mt-1 ${
        suggestion.priority === 'high' ? 'text-red-500' :
        suggestion.priority === 'medium' ? 'text-yellow-500' : 'text-blue-500'
      }`}>
        {suggestion.priority === 'high' ? <AlertTriangle className="w-4 h-4" /> :
         suggestion.priority === 'medium' ? <TrendingUp className="w-4 h-4" /> :
         <CheckCircle className="w-4 h-4" />}
      </div>
      <div className="flex-1">
        <h4 className="font-medium text-gray-800">{suggestion.category}</h4>
        <p className="text-sm text-gray-600 mb-1">{suggestion.suggestion}</p>
        <p className="text-xs text-blue-600 font-medium">{suggestion.action}</p>
      </div>
    </div>
  );

  const KeywordItem = ({ keyword, type = 'found' }) => (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2 ${
      type === 'found' 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {type === 'found' ? (
        <CheckCircle className="w-3 h-3 mr-1" />
      ) : (
        <XCircle className="w-3 h-3 mr-1" />
      )}
      {keyword.keyword}
    </span>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* PDF Notice */}
      {analysisData.fileType === 'pdf' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-amber-600 mr-2" />
            <div>
              <h4 className="font-medium text-amber-800">PDF Analysis Notice</h4>
              <p className="text-sm text-amber-700 mt-1">
                For more detailed analysis and better keyword extraction, consider uploading your resume as a Word document (.docx).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-800">ATS Analysis Results</h1>
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full font-bold text-xl ${getScoreBgColor(analysisData.overallScore)}`}>
              <span className={getScoreColor(analysisData.overallScore)}>
                Grade: {analysisData.grade}
              </span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(analysisData.overallScore)}`}>
              {analysisData.overallScore}%
            </div>
            <p className="text-gray-600">Overall ATS Score</p>
          </div>
          <div className="text-center">
            <div className={`text-lg font-medium ${
              analysisData.status === 'ATS-Friendly' ? 'text-green-600' : 'text-red-600'
            }`}>
              {analysisData.status}
            </div>
            <p className="text-gray-600">ATS Compatibility</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {analysisData.atsCompatibility?.score || 0}%
            </div>
            <p className="text-gray-600">Compatibility Score</p>
          </div>
        </div>
      </div>

      {/* Category Scores */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Detailed Score Breakdown
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard 
            title="Keywords" 
            score={analysisData.categoryScores?.keywords || 0}
            icon={Target}
            description="Relevance to job requirements"
          />
          <ScoreCard 
            title="Formatting" 
            score={analysisData.categoryScores?.formatting || 0}
            icon={FileText}
            description="ATS-friendly structure"
          />
          <ScoreCard 
            title="Content" 
            score={analysisData.categoryScores?.content || 0}
            icon={Award}
            description="Completeness and quality"
          />
          <ScoreCard 
            title="Structure" 
            score={analysisData.categoryScores?.structure || 0}
            icon={BarChart3}
            description="Organization and flow"
          />
        </div>
      </div>

      {/* ATS Compatibility */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">ATS Compatibility Assessment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Strengths */}
          {analysisData.atsCompatibility?.strengths?.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-700 mb-3 flex items-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Strengths
              </h3>
              <ul className="space-y-2">
                {analysisData.atsCompatibility.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Issues */}
          {analysisData.atsCompatibility?.issues?.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 mb-3 flex items-center">
                <XCircle className="w-4 h-4 mr-2" />
                Issues to Address
              </h3>
              <ul className="space-y-2">
                {analysisData.atsCompatibility.issues.map((issue, index) => (
                  <li key={index} className="flex items-start">
                    <XCircle className="w-4 h-4 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {analysisData.atsCompatibility?.recommendation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Recommendation</h4>
            <p className="text-blue-700">{analysisData.atsCompatibility.recommendation}</p>
          </div>
        )}
      </div>

      {/* Keywords Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Keyword Analysis</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Found Keywords */}
          {analysisData.keywords?.found?.length > 0 && (
            <div>
              <h3 className="font-semibold text-green-700 mb-3">
                Found Keywords ({analysisData.keywords.found.length})
              </h3>
              <div className="flex flex-wrap">
                {analysisData.keywords.found.map((keyword, index) => (
                  <KeywordItem key={index} keyword={keyword} type="found" />
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {analysisData.keywords?.missing?.length > 0 && (
            <div>
              <h3 className="font-semibold text-red-700 mb-3">
                Missing Keywords ({analysisData.keywords.missing.length})
              </h3>
              <div className="flex flex-wrap">
                {analysisData.keywords.missing.slice(0, 10).map((keyword, index) => (
                  <KeywordItem key={index} keyword={keyword} type="missing" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Keyword Suggestions */}
        {analysisData.keywords?.suggestions?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-blue-700 mb-3">Suggested Keywords to Add</h3>
            <div className="flex flex-wrap">
              {analysisData.keywords.suggestions.map((keyword, index) => (
                <span key={index} className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm mr-2 mb-2">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Improvement Suggestions */}
      {analysisData.suggestions?.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Improvement Suggestions</h2>
          <div className="grid grid-cols-1 gap-4">
            {analysisData.suggestions.map((suggestion, index) => (
              <SuggestionItem key={index} suggestion={suggestion} />
            ))}
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h2 className="text-xl font-bold mb-4">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Improve Score</h3>
            <p className="text-sm opacity-90">
              Address the high-priority suggestions to boost your ATS score
            </p>
          </div>
          <div className="text-center">
            <Target className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Add Keywords</h3>
            <p className="text-sm opacity-90">
              Include relevant keywords from the missing list
            </p>
          </div>
          <div className="text-center">
            <Award className="w-8 h-8 mx-auto mb-2" />
            <h3 className="font-semibold mb-2">Re-analyze</h3>
            <p className="text-sm opacity-90">
              Upload your improved resume for a new analysis
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
