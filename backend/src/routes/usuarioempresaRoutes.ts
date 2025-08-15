import { Router } from 'express';
import { UsuarioEmpresaController } from '@/controllers/UsuarioEmpresaController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateUsuarioEmpresaDto, UpdateUsuarioEmpresaDto } from '@/dtos/UsuarioEmpresaDto';

const router = Router();
const usuarioempresaController = new UsuarioEmpresaController();

// GET /usuarioempresa - List all usuarioempresa with pagination and filters
router.get('/', usuarioempresaController.list);

// GET /usuarioempresa/:id - Get usuarioempresa by ID
router.get('/:id', usuarioempresaController.getById);

// POST /usuarioempresa - Create new usuarioempresa
router.post('/', validateBody(CreateUsuarioEmpresaDto), usuarioempresaController.create);

// PUT /usuarioempresa/:id - Update usuarioempresa
router.put('/:id', validatePartialBody(UpdateUsuarioEmpresaDto), usuarioempresaController.update);

// DELETE /usuarioempresa/:id - Delete usuarioempresa
router.delete('/:id', usuarioempresaController.delete);

export default router;
