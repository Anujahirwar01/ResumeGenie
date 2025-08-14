import dotenv from 'dotenv';
dotenv.config();
import connectDB from '../db/db.js';
import mongoose from 'mongoose';

async function dropKeywordCollection() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Wait for connection to be established
    await new Promise(resolve => setTimeout(resolve, 1000));

    console.log('Dropping keyword database collection...');
    try {
      await mongoose.connection.db.dropCollection('keyworddatabases');
      console.log('✅ Keyword collection dropped successfully!');
    } catch (dropError) {
      if (dropError.message.includes('ns not found')) {
        console.log('✅ Collection does not exist, ready to create fresh!');
      } else {
        throw dropError;
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

dropKeywordCollection();
