// Export all models for easy importing
import User from './user.model.js';
import Analysis from './Analysis.js';
import KeywordDatabase from './KeywordDatabase.js';

// Convert CommonJS exports to ES6 for consistency
const AnalysisModel = Analysis;
const KeywordDatabaseModel = KeywordDatabase;

export {
  User,
  AnalysisModel as Analysis,
  KeywordDatabaseModel as KeywordDatabase
};

export default {
  User,
  Analysis: AnalysisModel,
  KeywordDatabase: KeywordDatabaseModel
};
