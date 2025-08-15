import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import { initializeDatabase } from '@/config/database';

// Import routes
import userRoutes from '@/routes/userRoutes';
import empresaRoutes from '@/routes/empresaRoutes';
import jwttokenRoutes from '@/routes/jwttokenRoutes';
import usuarioempresaRoutes from '@/routes/usuarioempresaRoutes';
import roleRoutes from '@/routes/roleRoutes';
import funcionarioRoutes from '@/routes/funcionarioRoutes';
import funcionariocontratoRoutes from '@/routes/funcionariocontratoRoutes';
import funcionariobeneficiodescontoRoutes from '@/routes/funcionariobeneficiodescontoRoutes';
import tarefatipoRoutes from '@/routes/tarefatipoRoutes';
import tarefaRoutes from '@/routes/tarefaRoutes';
import tarefafuncionariostatusRoutes from '@/routes/tarefafuncionariostatusRoutes';
import tarefafuncionariostatushistoriaRoutes from '@/routes/tarefafuncionariostatushistoriaRoutes';
import tarefahistoriaRoutes from '@/routes/tarefahistoriaRoutes';
import contaRoutes from '@/routes/contaRoutes';
import centrocustoRoutes from '@/routes/centrocustoRoutes';
import terceiroRoutes from '@/routes/terceiroRoutes';
import transacaofinanceiraRoutes from '@/routes/transacaofinanceiraRoutes';
import transacaocentrocustoRoutes from '@/routes/transacaocentrocustoRoutes';
import emprestimoRoutes from '@/routes/emprestimoRoutes';
import pedidocompraRoutes from '@/routes/pedidocompraRoutes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000');

// Middlewares
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
})); // Enable CORS
app.use(morgan('combined')); // Logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/empresas', empresaRoutes);
app.use('/api/jwt-tokens', jwttokenRoutes);
app.use('/api/usuario-empresas', usuarioempresaRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/funcionario-contratos', funcionariocontratoRoutes);
app.use('/api/funcionario-beneficio-descontos', funcionariobeneficiodescontoRoutes);
app.use('/api/tarefa-tipos', tarefatipoRoutes);
app.use('/api/tarefas', tarefaRoutes);
app.use('/api/tarefa-funcionario-status', tarefafuncionariostatusRoutes);
app.use('/api/tarefa-funcionario-status-historias', tarefafuncionariostatushistoriaRoutes);
app.use('/api/tarefa-historias', tarefahistoriaRoutes);
app.use('/api/contas', contaRoutes);
app.use('/api/centro-custos', centrocustoRoutes);
app.use('/api/terceiros', terceiroRoutes);
app.use('/api/transacao-financeiras', transacaofinanceiraRoutes);
app.use('/api/transacao-centro-custos', transacaocentrocustoRoutes);
app.use('/api/emprestimos', emprestimoRoutes);
app.use('/api/pedido-compras', pedidocompraRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global Error Handler:', error);

  // Handle validation errors
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details || error.message
    });
  }

  // Handle database errors
  if (error.code === '23505') { // Unique constraint violation
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry error',
      error: error.detail || error.message
    });
  }

  if (error.code === '23503') { // Foreign key constraint violation
    return res.status(400).json({
      success: false,
      message: 'Foreign key constraint error',
      error: error.detail || error.message
    });
  }

  // Handle custom app errors
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message || 'An error occurred'
    });
  }

  // Default server error
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
startServer();

export default app;

