import { Router } from 'express';
import { RoleController } from '@/controllers/RoleController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateRoleDto, UpdateRoleDto } from '@/dtos/RoleDto';

const router = Router();
const roleController = new RoleController();

// GET /role - List all role with pagination and filters
router.get('/', roleController.list);

// GET /role/:id - Get role by ID
router.get('/:id', roleController.getById);

// POST /role - Create new role
router.post('/', validateBody(CreateRoleDto), roleController.create);

// PUT /role/:id - Update role
router.put('/:id', validatePartialBody(UpdateRoleDto), roleController.update);

// DELETE /role/:id - Delete role
router.delete('/:id', roleController.delete);

export default router;
