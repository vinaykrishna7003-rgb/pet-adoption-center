import express from 'express'
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();
import routes from './routes/index.js';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: '*',
}));

app.use('/api/v1', routes);

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Pet Adoption Center API',
    version: '1.0.0',
    endpoints: {
      adopters: '/api/v1/adopters',
      pets: '/api/v1/pets',
      shelters: '/api/v1/shelters',
      applications: '/api/v1/applications',
      adoptions: '/api/v1/adoptions',
      staff: '/api/v1/staff',
      health: '/api/v1/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});


export default app;