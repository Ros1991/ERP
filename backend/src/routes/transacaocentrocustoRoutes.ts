import { Router } from 'express';
import { TransacaoCentroCustoController } from '@/controllers/TransacaoCentroCustoController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateTransacaoCentroCustoDto, UpdateTransacaoCentroCustoDto } from '@/dtos/TransacaoCentroCustoDto';

const router = Router();
const transacaocentrocustoController = new TransacaoCentroCustoController();

// GET /transacaocentrocusto - List all transacaocentrocusto with pagination and filters
router.get('/', transacaocentrocustoController.list);

// GET /transacaocentrocusto/:id - Get transacaocentrocusto by ID
router.get('/:id', transacaocentrocustoController.getById);

// POST /transacaocentrocusto - Create new transacaocentrocusto
router.post('/', validateBody(CreateTransacaoCentroCustoDto), transacaocentrocustoController.create);

// PUT /transacaocentrocusto/:id - Update transacaocentrocusto
router.put('/:id', validatePartialBody(UpdateTransacaoCentroCustoDto), transacaocentrocustoController.update);

// DELETE /transacaocentrocusto/:id - Delete transacaocentrocusto
router.delete('/:id', transacaocentrocustoController.delete);

export default router;
