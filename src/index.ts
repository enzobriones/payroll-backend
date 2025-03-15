import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import logger from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

//* Routes import
import addressRoutes from './routes/addressRoutes';
import afpRoutes from './routes/afpRoutes';
import authRoutes from './routes/authRoutes';
import departmentRoutes from './routes/departmentRoutes';
import employeeRoutes from './routes/employeeRoutes';
import healthPlanRoutes from './routes/healthPlanRoutes';
import healthRoutes from './routes/healthRoutes';
import payrollRoutes from './routes/payrollRoutes';

//* Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//* Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//* Routes
app.use('/api/addresses', addressRoutes)
app.use('/api/afps', afpRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/employees', employeeRoutes)
app.use('/api/health-plans', healthPlanRoutes)
app.use('/api/health', healthRoutes)
app.use('/api/payrolls', payrollRoutes)

//* Error
app.use(errorHandler);

//* Server
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${error}`);
    process.exit(1);
  }
};

startServer();

export default app;
