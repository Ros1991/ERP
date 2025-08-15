import { Router } from 'express';
import { TarefaHistoriaController } from '@/controllers/TarefaHistoriaController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTarefaHistoriaDto, UpdateTarefaHistoriaDto } from '@/dtos/TarefaHistoriaDto';

const router = Router();
const tarefahistoriaController = new TarefaHistoriaController();

// GET /tarefahistoria - List all tarefahistoria with pagination and filters
router.get('/', tarefahistoriaController.list);

// GET /tarefahistoria/:id - Get tarefahistoria by ID
router.get('/:id', tarefahistoriaController.getById);

// POST /tarefahistoria - Create new tarefahistoria
router.post('/', validateBody(CreateTarefaHistoriaDto), tarefahistoriaController.create);

// PUT /tarefahistoria/:id - Update tarefahistoria
router.put('/:id', validatePartialBody(UpdateTarefaHistoriaDto), tarefahistoriaController.update);

// DELETE /tarefahistoria/:id - Delete tarefahistoria
router.delete('/:id', tarefahistoriaController.delete);

export default router;
