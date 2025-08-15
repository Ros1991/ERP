import { Router } from 'express';
import { ContaController } from '@/controllers/ContaController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateContaDto, UpdateContaDto } from '@/dtos/ContaDto';

const router = Router();
const contaController = new ContaController();

// GET /conta - List all conta with pagination and filters
router.get('/', contaController.list);

// GET /conta/:id - Get conta by ID
router.get('/:id', contaController.getById);

// POST /conta - Create new conta
router.post('/', validateBody(CreateContaDto), contaController.create);

// PUT /conta/:id - Update conta
router.put('/:id', validatePartialBody(UpdateContaDto), contaController.update);

// DELETE /conta/:id - Delete conta
router.delete('/:id', contaController.delete);

export default router;
