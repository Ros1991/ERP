import { Router } from 'express';
import { FuncionarioContratoController } from '@/controllers/FuncionarioContratoController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateFuncionarioContratoDto, UpdateFuncionarioContratoDto } from '@/dtos/FuncionarioContratoDto';

const router = Router();
const funcionariocontratoController = new FuncionarioContratoController();

// GET /funcionariocontrato - List all funcionariocontrato with pagination and filters
router.get('/', funcionariocontratoController.list);

// GET /funcionariocontrato/:id - Get funcionariocontrato by ID
router.get('/:id', funcionariocontratoController.getById);

// POST /funcionariocontrato - Create new funcionariocontrato
router.post('/', validateBody(CreateFuncionarioContratoDto), funcionariocontratoController.create);

// PUT /funcionariocontrato/:id - Update funcionariocontrato
router.put('/:id', validatePartialBody(UpdateFuncionarioContratoDto), funcionariocontratoController.update);

// DELETE /funcionariocontrato/:id - Delete funcionariocontrato
router.delete('/:id', funcionariocontratoController.delete);

export default router;
