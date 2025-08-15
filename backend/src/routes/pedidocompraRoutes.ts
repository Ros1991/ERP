import { Router } from 'express';
import { PedidoCompraController } from '@/controllers/PedidoCompraController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreatePedidoCompraDto, UpdatePedidoCompraDto } from '@/dtos/PedidoCompraDto';

const router = Router();
const pedidocompraController = new PedidoCompraController();

// GET /pedidocompra - List all pedidocompra with pagination and filters
router.get('/', pedidocompraController.list);

// GET /pedidocompra/:id - Get pedidocompra by ID
router.get('/:id', pedidocompraController.getById);

// POST /pedidocompra - Create new pedidocompra
router.post('/', validateBody(CreatePedidoCompraDto), pedidocompraController.create);

// PUT /pedidocompra/:id - Update pedidocompra
router.put('/:id', validatePartialBody(UpdatePedidoCompraDto), pedidocompraController.update);

// DELETE /pedidocompra/:id - Delete pedidocompra
router.delete('/:id', pedidocompraController.delete);

export default router;
