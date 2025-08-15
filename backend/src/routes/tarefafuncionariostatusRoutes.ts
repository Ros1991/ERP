import { Router } from 'express';
import { TarefaFuncionarioStatusController } from '@/controllers/TarefaFuncionarioStatusController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTarefaFuncionarioStatusDto, UpdateTarefaFuncionarioStatusDto } from '@/dtos/TarefaFuncionarioStatusDto';

const router = Router();
const tarefafuncionariostatusController = new TarefaFuncionarioStatusController();

// GET /tarefafuncionariostatus - List all tarefafuncionariostatus with pagination and filters
router.get('/', tarefafuncionariostatusController.list);

// GET /tarefafuncionariostatus/:id - Get tarefafuncionariostatus by ID
router.get('/:id', tarefafuncionariostatusController.getById);

// POST /tarefafuncionariostatus - Create new tarefafuncionariostatus
router.post('/', validateBody(CreateTarefaFuncionarioStatusDto), tarefafuncionariostatusController.create);

// PUT /tarefafuncionariostatus/:id - Update tarefafuncionariostatus
router.put('/:id', validatePartialBody(UpdateTarefaFuncionarioStatusDto), tarefafuncionariostatusController.update);

// DELETE /tarefafuncionariostatus/:id - Delete tarefafuncionariostatus
router.delete('/:id', tarefafuncionariostatusController.delete);

export default router;
