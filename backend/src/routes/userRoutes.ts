import { Router } from 'express';
import { UserController } from '@/controllers/UserController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateUserDto, UpdateUserDto } from '@/dtos/UserDto';

const router = Router();
const userController = new UserController();

// GET /users - List all users with pagination and filters
router.get('/', userController.list);

// GET /users/:id - Get user by ID
router.get('/:id', userController.getById);

// POST /users - Create new user
router.post('/', validateBody(CreateUserDto), userController.create);

// PUT /users/:id - Update user
router.put('/:id', validatePartialBody(UpdateUserDto), userController.update);

// DELETE /users/:id - Delete user
router.delete('/:id', userController.delete);

export default router;

