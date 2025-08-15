import { Router } from 'express';
import { AuthController } from '@/controllers/AuthController';
import { authenticate } from '@/middleware/authMiddleware';
import { validateBody } from '@/core/validation/validationMiddleware';
import { LoginDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from '@/dtos/AuthDto';

const router = Router();
const authController = new AuthController();

// POST /auth/login - User login
router.post('/login', validateBody(LoginDto), authController.login);

// POST /auth/logout - User logout (requires authentication)
router.post('/logout', authenticate, authController.logout);

// POST /auth/forgot-password - Forgot password
router.post('/forgot-password', validateBody(ForgotPasswordDto), authController.forgotPassword);

// POST /auth/reset-password - Reset password using token
router.post('/reset-password', validateBody(ResetPasswordDto), authController.resetPassword);

// POST /auth/change-password - Change password (requires authentication)
router.post('/change-password', authenticate, validateBody(ChangePasswordDto), authController.changePassword);

// GET /auth/profile - Get current user profile (requires authentication)
router.get('/profile', authenticate, authController.profile);

// GET /auth/verify-token - Verify JWT token
router.get('/verify-token', authController.verifyToken);

export default router;
