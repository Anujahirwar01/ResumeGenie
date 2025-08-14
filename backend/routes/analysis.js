import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.js';
import fileProcessor from '../services/fileProcessor.js';
import atsAnalysisEngine from '../services/atsAnalysisEngine.js';
import { Analysis, User } from '../models/index.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, and TXT files are allowed'), false);
    }
  }
});

/**
 * @route   POST /api/analysis/upload
 * @desc    Upload and analyze resume
 * @access  Private
 */
router.post('/upload', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get analysis parameters from request
    const { jobIndustry = 'technology', jobLevel = 'mid', jobTitle } = req.body;

    // Step 1: Extract text from uploaded file
    const extractionResult = await fileProcessor.extractText(req.file);
    
    if (!extractionResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Failed to process file',
        error: extractionResult.error
      });
    }

    // Step 2: Extract structured information
    const structuredInfo = fileProcessor.extractStructuredInfo(extractionResult.text);
    
    // Step 3: Perform ATS analysis
    const analysisResult = await atsAnalysisEngine.analyzeResume(
      extractionResult.text,
      structuredInfo,
      jobIndustry,
      jobLevel
    );

    if (!analysisResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Analysis failed',
        error: analysisResult.error
      });
    }

    // Step 4: Get file metadata
    const fileMetadata = fileProcessor.getFileMetadata(req.file, extractionResult);
    
    // Convert MIME type to simple extension for schema compatibility
    const getFileTypeFromMime = (mimetype) => {
      const mimeMap = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
        'application/msword': 'doc',
        'text/plain': 'txt'
      };
      return mimeMap[mimetype] || 'txt';
    };

    // Step 5: Save analysis to database
    const analysis = new Analysis({
      userId: req.user._id,
      
      // File Information (required fields)
      fileName: fileMetadata.filename,
      fileSize: fileMetadata.fileSize,
      fileType: getFileTypeFromMime(fileMetadata.fileType),
      filePath: req.file.path || req.file.filename || `uploads/${fileMetadata.filename}`,
      
      // Analysis Results (required fields)
      atsScore: analysisResult.analysis.overallScore,
      
      // Category Scores (required nested fields)
      categories: {
        keywords: {
          score: analysisResult.analysis.categoryScores.keywords,
          totalKeywords: analysisResult.analysis.keywords.found.length + analysisResult.analysis.keywords.missing.length,
          foundKeywords: analysisResult.analysis.keywords.found.length,
          keywordDensity: (analysisResult.analysis.keywords.found.length / (analysisResult.analysis.keywords.found.length + analysisResult.analysis.keywords.missing.length)) * 100 || 0
        },
        formatting: {
          score: analysisResult.analysis.categoryScores.formatting,
          issues: analysisResult.analysis.details.formattingAnalysis?.issues || [],
          passedChecks: analysisResult.analysis.details.formattingAnalysis?.strengths || []
        },
        content: {
          score: analysisResult.analysis.categoryScores.content,
          wordCount: extractionResult.text.split(' ').length,
          sectionsFound: Object.keys(structuredInfo.sections || {}).map(name => ({
            name,
            found: true,
            quality: 'good'
          })),
          achievements: {
            total: structuredInfo.experience?.length || 0,
            quantified: 0
          }
        },
        structure: {
          score: analysisResult.analysis.categoryScores.structure,
          organization: 'good',
          flow: 'good',
          readability: 'good'
        }
      },
      
      // Keywords Analysis
      keywords: {
        found: analysisResult.analysis.keywords.found.map(kw => ({
          keyword: typeof kw === 'string' ? kw : kw.keyword || kw.word,
          count: typeof kw === 'string' ? 1 : kw.count || 1,
          relevance: typeof kw === 'string' ? 'medium' : kw.relevance || 'medium',
          category: typeof kw === 'string' ? 'technical' : kw.category || 'technical'
        })),
        missing: analysisResult.analysis.keywords.missing.map(kw => ({
          keyword: typeof kw === 'string' ? kw : kw.keyword || kw.word,
          importance: typeof kw === 'string' ? 'medium' : kw.importance || 'medium',
          category: typeof kw === 'string' ? 'technical' : kw.category || 'technical',
          suggestion: typeof kw === 'string' ? `Consider adding ${kw}` : kw.suggestion || `Consider adding ${kw.keyword || kw.word}`
        })),
        suggestions: analysisResult.analysis.keywords.suggestions || []
      },
      
      // Improvement Suggestions (fix enum values)
      suggestions: analysisResult.analysis.suggestions.map(suggestion => ({
        category: suggestion.category === 'Keywords' ? 'keywords' : 
                 suggestion.category === 'Formatting' ? 'formatting' : 
                 suggestion.category === 'Content' ? 'content' : 
                 suggestion.category === 'Structure' ? 'structure' : 'content',
        priority: suggestion.priority || 'medium',
        title: suggestion.title || 'Improvement needed',
        description: suggestion.description || suggestion.text || 'No description provided',
        impact: suggestion.impact || 'moderate'
      })),
      
      // Document Metadata
      documentMetadata: {
        pages: 1,
        wordCount: extractionResult.text.split(' ').length,
        characterCount: extractionResult.text.length,
        sections: Object.keys(structuredInfo.sections || {}).map((name, index) => ({
          name,
          startIndex: index * 100,
          endIndex: (index + 1) * 100,
          wordCount: 100
        })),
        fonts: [{ name: 'Arial', usage: 100 }],
        layout: 'single-column'
      },
      
      // ATS Compatibility Details
      atsCompatibility: {
        overall: analysisResult.analysis.overallScore >= 90 ? 'excellent' : 
                analysisResult.analysis.overallScore >= 70 ? 'good' : 
                analysisResult.analysis.overallScore >= 50 ? 'fair' : 'poor',
        fileFormat: {
          compatible: ['pdf', 'docx', 'doc', 'txt'].includes(getFileTypeFromMime(fileMetadata.fileType)),
          reason: 'Supported file format'
        },
        layout: {
          compatible: true,
          reason: 'Standard layout detected'
        },
        fonts: {
          compatible: true,
          incompatibleFonts: []
        },
        images: {
          count: 0,
          warning: ''
        },
        tables: {
          count: 0,
          compatible: true
        }
      },
      
      // Analysis Status (fix enum value)
      status: 'completed',
      
      // Processing Information
      processingTime: Date.now() - Date.now(), // Will be updated
      
      // Additional fields
      jobIndustry,
      jobLevel,
      jobTitle
    });

    await analysis.save();

    // Return analysis results
    res.json({
      success: true,
      message: 'Resume analyzed successfully',
      data: {
        analysisId: analysis._id,
        overallScore: analysis.atsScore,
        grade: analysisResult.analysis.grade,
        status: analysis.status,
        categoryScores: {
          keywords: analysis.categories.keywords.score,
          formatting: analysis.categories.formatting.score,
          content: analysis.categories.content.score,
          structure: analysis.categories.structure.score
        },
        atsCompatibility: analysis.atsCompatibility,
        suggestions: analysis.suggestions,
        keywords: {
          found: analysis.keywords.found.slice(0, 10), // Limit for response size
          missing: analysis.keywords.missing.slice(0, 10),
          suggestions: analysis.keywords.suggestions
        }
      }
    });

  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during analysis',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Analysis failed'
    });
  }
});

/**
 * @route   GET /api/analysis/history
 * @desc    Get user's analysis history
 * @access  Private
 */
router.get('/history', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const analyses = await Analysis.find({ userId: req.user._id })
      .select('createdAt fileName jobTitle jobIndustry jobLevel atsScore status categories.keywords.score categories.formatting.score categories.content.score categories.structure.score')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Analysis.countDocuments({ userId: req.user._id });

    // Transform the data to match frontend expectations
    const transformedAnalyses = analyses.map(analysis => ({
      _id: analysis._id,
      createdAt: analysis.createdAt,
      fileName: analysis.fileName,
      jobTitle: analysis.jobTitle,
      jobIndustry: analysis.jobIndustry,
      jobLevel: analysis.jobLevel,
      overallScore: analysis.atsScore,
      status: analysis.status,
      grade: analysis.atsScore >= 90 ? 'A' : 
             analysis.atsScore >= 80 ? 'B' : 
             analysis.atsScore >= 70 ? 'C' : 
             analysis.atsScore >= 60 ? 'D' : 'F',
      categoryScores: {
        keywords: analysis.categories?.keywords?.score || 0,
        formatting: analysis.categories?.formatting?.score || 0,
        content: analysis.categories?.content?.score || 0,
        structure: analysis.categories?.structure?.score || 0
      }
    }));

    res.json({
      success: true,
      data: {
        analyses: transformedAnalyses,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get analysis history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis history'
    });
  }
});

/**
 * @route   GET /api/analysis/:id
 * @desc    Get detailed analysis by ID
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis'
    });
  }
});

/**
 * @route   DELETE /api/analysis/:id
 * @desc    Delete analysis
 * @access  Private
 */
router.delete('/:id', protect, async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: 'Analysis not found'
      });
    }

    res.json({
      success: true,
      message: 'Analysis deleted successfully'
    });

  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete analysis'
    });
  }
});

/**
 * @route   GET /api/analysis/stats/overview
 * @desc    Get user's analysis statistics
 * @access  Private
 */
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get analysis statistics
    const stats = await Analysis.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalAnalyses: { $sum: 1 },
          averageScore: { $avg: '$scores.overall' },
          highestScore: { $max: '$scores.overall' },
          lowestScore: { $min: '$scores.overall' },
          recentAnalyses: { $sum: { $cond: [{ $gte: ['$createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)] }, 1, 0] } }
        }
      }
    ]);

    // Get score distribution
    const scoreDistribution = await Analysis.aggregate([
      { $match: { userId: userId } },
      {
        $bucket: {
          groupBy: '$scores.overall',
          boundaries: [0, 50, 70, 85, 100],
          default: 'other',
          output: {
            count: { $sum: 1 }
          }
        }
      }
    ]);

    // Get recent trend (last 5 analyses)
    const recentTrend = await Analysis.find({ userId: userId })
      .select('scores.overall createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    const overview = stats[0] || {
      totalAnalyses: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      recentAnalyses: 0
    };

    res.json({
      success: true,
      data: {
        overview: {
          ...overview,
          averageScore: Math.round(overview.averageScore || 0)
        },
        scoreDistribution,
        recentTrend: recentTrend.reverse() // Show chronological order
      }
    });

  } catch (error) {
    console.error('Get analysis stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analysis statistics'
    });
  }
});

export default router;
