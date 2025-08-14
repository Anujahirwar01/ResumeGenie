// Export all models for easy importing
import User from './user.model.js';
import Analysis from './Analysis.js';
import KeywordDatabase from './KeywordDatabase.js';
import Report from './Report.js';
import ATSSystem from './ATSSystem.js';

// Convert CommonJS exports to ES6 for consistency
const AnalysisModel = Analysis;
const KeywordDatabaseModel = KeywordDatabase;
const ReportModel = Report;
const ATSSystemModel = ATSSystem;

export {
  User,
  AnalysisModel as Analysis,
  KeywordDatabaseModel as KeywordDatabase,
  ReportModel as Report,
  ATSSystemModel as ATSSystem
};

export default {
  User,
  Analysis: AnalysisModel,
  KeywordDatabase: KeywordDatabaseModel,
  Report: ReportModel,
  ATSSystem: ATSSystemModel
};
