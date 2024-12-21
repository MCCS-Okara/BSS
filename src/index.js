import { app } from "./app.js";
import connectDB from "./db/index.js";


// Start the server
const PORT = process.env.PORT || 3000;


// Now you can use connectDB
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log(`MongoDB connection error: ${error}`);
    });