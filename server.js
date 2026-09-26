require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { connectDB, isConnected } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const rootDirectory = __dirname;
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || '0.0.0.0';

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Custom request logger
app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
        console.log(`[API ${req.method}] ${req.path}`);
    }
    next();
});

// API Routes
app.use('/api', apiRoutes);

// Static file serving with proper caching & mime types
app.use(express.static(rootDirectory, {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
        }
        res.setHeader('X-Content-Type-Options', 'nosniff');
    }
}));

// Route for root
app.get('/', (req, res) => {
    res.sendFile(path.join(rootDirectory, 'index.html'));
});

// Route for auth
app.get('/auth', (req, res) => {
    res.sendFile(path.join(rootDirectory, 'auth.html'));
});

// Fallback to index.html for client-side navigation (Express 5 compatible)
app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
        return res.sendFile(path.join(rootDirectory, 'index.html'));
    }
    next();
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal Server Error'
    });
});

// Initialize database and start server
async function startServer() {
    await connectDB();

    app.listen(port, () => {
        console.log(`====================================================`);
        console.log(`🌾 AgriPrice Hub is online & ready!`);
        console.log(`📡 Local URL:       http://localhost:${port}`);
        console.log(`🌐 Network URL:     http://${host}:${port}`);
        console.log(`💾 Database:        ${isConnected() ? 'MongoDB Connected' : 'Resilient In-Memory Buffer (MongoDB starting/offline)'}`);
        console.log(`🚀 REST API:        http://localhost:${port}/api/health`);
        console.log(`====================================================`);
    });
}

startServer();