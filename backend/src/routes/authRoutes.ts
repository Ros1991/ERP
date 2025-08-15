import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware, requireCompanyPermission } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Rotas públicas (sem autenticação)
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/facial-login', authController.facialLogin);
router.post('/refresh-token', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/accept-invite', authController.acceptInvite);

// Rotas protegidas (requerem autenticação)
router.use(authMiddleware);

// Rotas do usuário autenticado
router.get('/profile', authController.getProfile);
router.put('/profile', authController.updateProfile);
router.post('/change-password', authController.changePassword);
router.post('/register-face', authController.registerFace);
router.delete('/remove-face', authController.removeFace);
router.get('/companies', authController.getUserCompanies);
router.post('/logout', authController.logout);
router.get('/validate-token', authController.validateToken);

// Rotas de gerenciamento de empresa (requerem permissão específica)
router.post('/companies/:companyId/invite', 
  requireCompanyPermission('users.manage'), 
  authController.inviteUser
);

router.post('/companies/:companyId/revoke-access', 
  requireCompanyPermission('users.manage'), 
  authController.revokeAccess
);

export default router;

