import express from "express";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import viewsRoutes from './routes/viewroutes.js'; // Import your routes
import studentsroutes from './routes/studentsroutes.js'
import './schedulers/feeScheduler.js'; // Make sure the path is correct

const app = express(); 

// Derive __filename and __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Who can access
app.use(cors({origin: process.env.CORS_ORIGIN,credentials: true}));

// Parse JSON and URL-encoded data with size limits
app.use(express.json({ limit: "16mb" }));
app.use(express.urlencoded({ extended: true, limit: "16mb" }));
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve static files from the 'script' directory
app.use('/script', express.static(path.join(__dirname, '../src/views/script')));


// Use the routes from the viewsRoutes file
app.use('/', viewsRoutes);
app.use('/api', studentsroutes);




// ApiError Midleware
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error stack for debugging (optional)
    
    res.status(err.statusCode || 500).json({ 
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

export { app };
