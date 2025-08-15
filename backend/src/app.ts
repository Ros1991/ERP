import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from 'dotenv';
import { AppDataSource } from './config/database';
import { ResponseBuilder } from './utils/ResponseBuilder';
import { AppError } from './utils/AppError';
import { AdminSeed } from './seeds/AdminSeed';

// Import routes
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import financialRoutes from './routes/financialRoutes';
import taskRoutes from './routes/taskRoutes';
import payrollRoutes from './routes/payrollRoutes';

// Load environment variables
config();

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: ResponseBuilder.error('Muitas tentativas. Tente novamente em alguns minutos.'),
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', employeeRoutes);
app.use('/api', financialRoutes);
app.use('/api', taskRoutes);
app.use('/api', payrollRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json(ResponseBuilder.notFound('Endpoint não encontrado'));
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json(ResponseBuilder.error(error.message));
    return;
  }

  // Database errors
  if (error.code === '23505') { // Unique constraint violation
    res.status(409).json(ResponseBuilder.conflict('Registro já existe'));
    return;
  }

  if (error.code === '23503') { // Foreign key constraint violation
    res.status(400).json(ResponseBuilder.error('Referência inválida'));
    return;
  }

  if (error.code === '23502') { // Not null constraint violation
    res.status(400).json(ResponseBuilder.error('Campo obrigatório não informado'));
    return;
  }

  // Validation errors
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map((err: any) => err.message);
    res.status(400).json(ResponseBuilder.validationError(validationErrors));
    return;
  }

  // JSON parsing errors
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json(ResponseBuilder.error('JSON inválido'));
    return;
  }

  // Default error
  res.status(500).json(ResponseBuilder.error('Erro interno do servidor'));
});

// Initialize database and start server
const PORT = parseInt(process.env.PORT || '3001', 10);

async function startServer() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Conexão com banco de dados estabelecida');

    // Run migrations
    await AppDataSource.runMigrations();
    console.log('✅ Migrations executadas com sucesso');

    // Run admin seed (only if no users exist)
    await AdminSeed.run();

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📊 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

  } catch (error) {
    console.error('❌ Erro ao inicializar servidor:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Recebido SIGTERM, encerrando servidor...');
  
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Conexão com banco de dados encerrada');
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🔄 Recebido SIGINT, encerrando servidor...');
  
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
    console.log('✅ Conexão com banco de dados encerrada');
  }
  
  process.exit(0);
});

// Start the server
startServer();

export default app;

