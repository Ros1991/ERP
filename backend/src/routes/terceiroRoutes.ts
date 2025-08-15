import { Router } from 'express';
import { TerceiroController } from '@/controllers/TerceiroController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTerceiroDto, UpdateTerceiroDto } from '@/dtos/TerceiroDto';

const router = Router();
const terceiroController = new TerceiroController();

// GET /terceiro - List all terceiro with pagination and filters
router.get('/', terceiroController.list);

// GET /terceiro/:id - Get terceiro by ID
router.get('/:id', terceiroController.getById);

// POST /terceiro - Create new terceiro
router.post('/', validateBody(CreateTerceiroDto), terceiroController.create);

// PUT /terceiro/:id - Update terceiro
router.put('/:id', validatePartialBody(UpdateTerceiroDto), terceiroController.update);

// DELETE /terceiro/:id - Delete terceiro
router.delete('/:id', terceiroController.delete);

export default router;
