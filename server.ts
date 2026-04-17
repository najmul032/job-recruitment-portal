import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoutes from './backend/routes/authRoutes.ts';
import jobRoutes from './backend/routes/jobRoutes.ts';
import applicationRoutes from './backend/routes/applicationRoutes.ts';
import profileRoutes from './backend/routes/profileRoutes.ts';
import adminRoutes from './backend/routes/adminRoutes.ts';
import companyRoutes from './backend/routes/companyRoutes.ts';
// DB
import { testConnection } from './backend/config/db.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  await testConnection();

  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/companies', companyRoutes);

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      message: 'Job Recruitment Portal API is running.',
    });
  });

  app.get('/', (req, res) => {
    res.send('Backend is running successfully');
  });

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('❌ Server failed to start:', error);
});