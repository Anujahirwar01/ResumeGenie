import FileProcessorEnhanced from './services/fileProcessor_enhanced.js';

// Test the enhanced file processor
const fileProcessor = new FileProcessorEnhanced();

// Create a mock file object
const mockFile = {
  originalname: 'test-resume.pdf',
  mimetype: 'application/pdf',
  size: 1024,
  buffer: Buffer.from('test content')
};

async function testEnhancedProcessor() {
  try {
    console.log('Testing Enhanced File Processor...');
    
    // Test validation
    const validation = fileProcessor.validateFile(mockFile);
    console.log('Validation result:', validation);
    
    // Test text extraction (will return sample resume)
    const extractionResult = await fileProcessor.extractText(mockFile);
    
    console.log('\n=== EXTRACTION RESULTS ===');
    console.log('Text length:', extractionResult.text.length);
    console.log('Personal Info:', extractionResult.structured.personalInfo);
    console.log('Contact Info:', {
      email: extractionResult.structured.email,
      phone: extractionResult.structured.phone,
      location: extractionResult.structured.location
    });
    console.log('Skills found:', extractionResult.structured.skills.length);
    console.log('Experience entries:', extractionResult.structured.experience.length);
    console.log('Education entries:', extractionResult.structured.education.length);
    console.log('Metrics found:', extractionResult.structured.metrics.length);
    console.log('Language Quality:', extractionResult.structured.languageQuality);
    
    console.log('\n=== SAMPLE METRICS ===');
    console.log(extractionResult.structured.metrics.slice(0, 5));
    
    console.log('\n=== SAMPLE SKILLS ===');
    console.log(extractionResult.structured.skills.slice(0, 10));
    
    console.log('\n=== FIRST EXPERIENCE ENTRY ===');
    if (extractionResult.structured.experience.length > 0) {
      console.log(JSON.stringify(extractionResult.structured.experience[0], null, 2));
    }
    
    console.log('\nEnhanced File Processor Test Complete! ✅');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testEnhancedProcessor();
