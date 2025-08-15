import { Router } from 'express';
import { TarefaController } from '@/controllers/TarefaController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTarefaDto, UpdateTarefaDto } from '@/dtos/TarefaDto';

const router = Router();
const tarefaController = new TarefaController();

// GET /tarefa - List all tarefa with pagination and filters
router.get('/', tarefaController.list);

// GET /tarefa/:id - Get tarefa by ID
router.get('/:id', tarefaController.getById);

// POST /tarefa - Create new tarefa
router.post('/', validateBody(CreateTarefaDto), tarefaController.create);

// PUT /tarefa/:id - Update tarefa
router.put('/:id', validatePartialBody(UpdateTarefaDto), tarefaController.update);

// DELETE /tarefa/:id - Delete tarefa
router.delete('/:id', tarefaController.delete);

export default router;
