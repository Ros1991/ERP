import { Router } from 'express';
import { FuncionarioBeneficioDescontoController } from '@/controllers/FuncionarioBeneficioDescontoController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateFuncionarioBeneficioDescontoDto, UpdateFuncionarioBeneficioDescontoDto } from '@/dtos/FuncionarioBeneficioDescontoDto';

const router = Router();
const funcionariobeneficiodescontoController = new FuncionarioBeneficioDescontoController();

// GET /funcionariobeneficiodesconto - List all funcionariobeneficiodesconto with pagination and filters
router.get('/', funcionariobeneficiodescontoController.list);

// GET /funcionariobeneficiodesconto/:id - Get funcionariobeneficiodesconto by ID
router.get('/:id', funcionariobeneficiodescontoController.getById);

// POST /funcionariobeneficiodesconto - Create new funcionariobeneficiodesconto
router.post('/', validateBody(CreateFuncionarioBeneficioDescontoDto), funcionariobeneficiodescontoController.create);

// PUT /funcionariobeneficiodesconto/:id - Update funcionariobeneficiodesconto
router.put('/:id', validatePartialBody(UpdateFuncionarioBeneficioDescontoDto), funcionariobeneficiodescontoController.update);

// DELETE /funcionariobeneficiodesconto/:id - Delete funcionariobeneficiodesconto
router.delete('/:id', funcionariobeneficiodescontoController.delete);

export default router;
