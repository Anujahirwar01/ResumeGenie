import React, { createContext, useContext, useState } from 'react';

const AnalysisContext = createContext();

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const addToHistory = (analysis) => {
    setAnalysisHistory(prev => [analysis, ...prev]);
  };

  const clearCurrentAnalysis = () => {
    setCurrentAnalysis(null);
  };

  const value = {
    currentAnalysis,
    setCurrentAnalysis,
    analysisHistory,
    setAnalysisHistory,
    addToHistory,
    isAnalyzing,
    setIsAnalyzing,
    clearCurrentAnalysis
  };

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};

export default AnalysisContext;
