import { Router } from 'express';
import { EmpresaController } from '@/controllers/EmpresaController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateEmpresaDto, UpdateEmpresaDto } from '@/dtos/EmpresaDto';
import { authenticate } from '@/middleware/authMiddleware';

const router = Router();
const empresaController = new EmpresaController();

// GET /empresa - List all empresa with pagination and filters
router.get('/', empresaController.list);

// GET /empresa/minhas - Get user's companies
router.get('/minhas', authenticate, empresaController.getMyEmpresas);

// GET /empresa/:id - Get empresa by ID
router.get('/:id', empresaController.getById);

// POST /empresa - Create new empresa
router.post('/', authenticate, validateBody(CreateEmpresaDto), empresaController.create);

// PUT /empresa/:id - Update empresa
router.put('/:id', validatePartialBody(UpdateEmpresaDto), empresaController.update);

// DELETE /empresa/:id - Delete empresa
router.delete('/:id', empresaController.delete);

export default router;
