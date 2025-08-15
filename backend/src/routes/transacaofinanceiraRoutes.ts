import { Router } from 'express';
import { TransacaoFinanceiraController } from '@/controllers/TransacaoFinanceiraController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTransacaoFinanceiraDto, UpdateTransacaoFinanceiraDto } from '@/dtos/TransacaoFinanceiraDto';

const router = Router();
const transacaofinanceiraController = new TransacaoFinanceiraController();

// GET /transacaofinanceira - List all transacaofinanceira with pagination and filters
router.get('/', transacaofinanceiraController.list);

// GET /transacaofinanceira/:id - Get transacaofinanceira by ID
router.get('/:id', transacaofinanceiraController.getById);

// POST /transacaofinanceira - Create new transacaofinanceira
router.post('/', validateBody(CreateTransacaoFinanceiraDto), transacaofinanceiraController.create);

// PUT /transacaofinanceira/:id - Update transacaofinanceira
router.put('/:id', validatePartialBody(UpdateTransacaoFinanceiraDto), transacaofinanceiraController.update);

// DELETE /transacaofinanceira/:id - Delete transacaofinanceira
router.delete('/:id', transacaofinanceiraController.delete);

export default router;
