import { Router } from 'express';
import { TarefaTipoController } from '@/controllers/TarefaTipoController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTarefaTipoDto, UpdateTarefaTipoDto } from '@/dtos/TarefaTipoDto';

const router = Router();
const tarefatipoController = new TarefaTipoController();

// GET /tarefatipo - List all tarefatipo with pagination and filters
router.get('/', tarefatipoController.list);

// GET /tarefatipo/:id - Get tarefatipo by ID
router.get('/:id', tarefatipoController.getById);

// POST /tarefatipo - Create new tarefatipo
router.post('/', validateBody(CreateTarefaTipoDto), tarefatipoController.create);

// PUT /tarefatipo/:id - Update tarefatipo
router.put('/:id', validatePartialBody(UpdateTarefaTipoDto), tarefatipoController.update);

// DELETE /tarefatipo/:id - Delete tarefatipo
router.delete('/:id', tarefatipoController.delete);

export default router;
