import { Router } from 'express';
import { EmprestimoController } from '@/controllers/EmprestimoController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateEmprestimoDto, UpdateEmprestimoDto } from '@/dtos/EmprestimoDto';

const router = Router();
const emprestimoController = new EmprestimoController();

// GET /emprestimo - List all emprestimo with pagination and filters
router.get('/', emprestimoController.list);

// GET /emprestimo/:id - Get emprestimo by ID
router.get('/:id', emprestimoController.getById);

// POST /emprestimo - Create new emprestimo
router.post('/', validateBody(CreateEmprestimoDto), emprestimoController.create);

// PUT /emprestimo/:id - Update emprestimo
router.put('/:id', validatePartialBody(UpdateEmprestimoDto), emprestimoController.update);

// DELETE /emprestimo/:id - Delete emprestimo
router.delete('/:id', emprestimoController.delete);

export default router;
