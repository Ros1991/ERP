import { Router } from 'express';
import { FuncionarioController } from '@/controllers/FuncionarioController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateFuncionarioDto, UpdateFuncionarioDto } from '@/dtos/FuncionarioDto';

const router = Router();
const funcionarioController = new FuncionarioController();

// GET /funcionario - List all funcionario with pagination and filters
router.get('/', funcionarioController.list);

// GET /funcionario/:id - Get funcionario by ID
router.get('/:id', funcionarioController.getById);

// POST /funcionario - Create new funcionario
router.post('/', validateBody(CreateFuncionarioDto), funcionarioController.create);

// PUT /funcionario/:id - Update funcionario
router.put('/:id', validatePartialBody(UpdateFuncionarioDto), funcionarioController.update);

// DELETE /funcionario/:id - Delete funcionario
router.delete('/:id', funcionarioController.delete);

export default router;
