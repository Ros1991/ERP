import { Router } from 'express';
import { TarefaFuncionarioStatusHistoriaController } from '@/controllers/TarefaFuncionarioStatusHistoriaController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTarefaFuncionarioStatusHistoriaDto, UpdateTarefaFuncionarioStatusHistoriaDto } from '@/dtos/TarefaFuncionarioStatusHistoriaDto';

const router = Router();
const tarefafuncionariostatushistoriaController = new TarefaFuncionarioStatusHistoriaController();

// GET /tarefafuncionariostatushistoria - List all tarefafuncionariostatushistoria with pagination and filters
router.get('/', tarefafuncionariostatushistoriaController.list);

// GET /tarefafuncionariostatushistoria/:id - Get tarefafuncionariostatushistoria by ID
router.get('/:id', tarefafuncionariostatushistoriaController.getById);

// POST /tarefafuncionariostatushistoria - Create new tarefafuncionariostatushistoria
router.post('/', validateBody(CreateTarefaFuncionarioStatusHistoriaDto), tarefafuncionariostatushistoriaController.create);

// PUT /tarefafuncionariostatushistoria/:id - Update tarefafuncionariostatushistoria
router.put('/:id', validatePartialBody(UpdateTarefaFuncionarioStatusHistoriaDto), tarefafuncionariostatushistoriaController.update);

// DELETE /tarefafuncionariostatushistoria/:id - Delete tarefafuncionariostatushistoria
router.delete('/:id', tarefafuncionariostatushistoriaController.delete);

export default router;
