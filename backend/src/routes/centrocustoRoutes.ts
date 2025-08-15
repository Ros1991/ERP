import { Router } from 'express';
import { CentroCustoController } from '@/controllers/CentroCustoController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateCentroCustoDto, UpdateCentroCustoDto } from '@/dtos/CentroCustoDto';

const router = Router();
const centrocustoController = new CentroCustoController();

// GET /centrocusto - List all centrocusto with pagination and filters
router.get('/', centrocustoController.list);

// GET /centrocusto/:id - Get centrocusto by ID
router.get('/:id', centrocustoController.getById);

// POST /centrocusto - Create new centrocusto
router.post('/', validateBody(CreateCentroCustoDto), centrocustoController.create);

// PUT /centrocusto/:id - Update centrocusto
router.put('/:id', validatePartialBody(UpdateCentroCustoDto), centrocustoController.update);

// DELETE /centrocusto/:id - Delete centrocusto
router.delete('/:id', centrocustoController.delete);

export default router;
