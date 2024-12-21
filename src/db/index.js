import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';


// Define the async function for connecting to the database
const connectDB = async () => {
  try {
    
    const connectionInstance = await mongoose.connect(`mongodb+srv://blooms:blooms@haris.t2td4.mongodb.net/${DB_NAME}`);

    // const connectionInstance = await mongoose.connect(`mongodb://localhost:27017/`);
    console.log(`\n Mongo db connected! DB host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("MongoDB Connection error", error);
    process.exit(1);
  }
};

// Export the function as the default export
export default connectDB; 