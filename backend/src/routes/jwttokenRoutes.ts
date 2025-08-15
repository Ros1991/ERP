import { Router } from 'express';
import { JwtTokenController } from '@/controllers/JwtTokenController';
import { validateBody, validatePartialBody } from '@/core/validation/validationMiddleware';
import { CreateJwtTokenDto, UpdateJwtTokenDto } from '@/dtos/JwtTokenDto';

const router = Router();
const jwttokenController = new JwtTokenController();

// GET /jwttoken - List all jwttoken with pagination and filters
router.get('/', jwttokenController.list);

// GET /jwttoken/:id - Get jwttoken by ID
router.get('/:id', jwttokenController.getById);

// POST /jwttoken - Create new jwttoken
router.post('/', validateBody(CreateJwtTokenDto), jwttokenController.create);

// PUT /jwttoken/:id - Update jwttoken
router.put('/:id', validatePartialBody(UpdateJwtTokenDto), jwttokenController.update);

// DELETE /jwttoken/:id - Delete jwttoken
router.delete('/:id', jwttokenController.delete);

export default router;
