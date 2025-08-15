import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '../services/AuthService';
import { 
  RegisterDto, 
  LoginDto, 
  FacialLoginDto, 
  RegisterFaceDto, 
  RefreshTokenDto, 
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  UpdateProfileDto,
  InviteUserDto,
  AcceptInviteDto,
  RevokeAccessDto
} from '../dtos/AuthDto';

export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.register.bind(this.authService),
      successMessage: 'Usuário registrado com sucesso',
      successStatus: 201,
      dtoClass: RegisterDto,
      validateDto: true
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.login.bind(this.authService),
      successMessage: 'Login realizado com sucesso',
      dtoClass: LoginDto,
      validateDto: true
    });
  };

  facialLogin = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.facialLogin.bind(this.authService),
      successMessage: 'Login facial realizado com sucesso',
      dtoClass: FacialLoginDto,
      validateDto: true
    });
  };

  registerFace = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.registerFace.bind(this.authService),
      serviceArgs: [userId],
      successMessage: 'Reconhecimento facial registrado com sucesso',
      dtoClass: RegisterFaceDto,
      validateDto: true
    });
  };

  removeFace = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.authService.removeFace(userId),
      successMessage: 'Reconhecimento facial removido com sucesso'
    });
  };

  refreshToken = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.refreshToken.bind(this.authService),
      successMessage: 'Token renovado com sucesso',
      dtoClass: RefreshTokenDto,
      validateDto: true
    });
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.changePassword.bind(this.authService),
      serviceArgs: [userId],
      successMessage: 'Senha alterada com sucesso',
      dtoClass: ChangePasswordDto,
      validateDto: true
    });
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.forgotPassword.bind(this.authService),
      successMessage: 'Instruções enviadas por email',
      dtoClass: ForgotPasswordDto,
      validateDto: true
    });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.resetPassword.bind(this.authService),
      successMessage: 'Senha redefinida com sucesso',
      dtoClass: ResetPasswordDto,
      validateDto: true
    });
  };

  updateProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.updateProfile.bind(this.authService),
      serviceArgs: [userId],
      successMessage: 'Perfil atualizado com sucesso',
      dtoClass: UpdateProfileDto,
      validateDto: true
    });
  };

  getProfile = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.authService.getProfile(userId),
      successMessage: 'Perfil recuperado com sucesso'
    });
  };

  getUserCompanies = async (req: Request, res: Response): Promise<void> => {
    const userId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequestWithId(req, res, {
      serviceMethod: () => this.authService.getUserCompanies(userId),
      successMessage: 'Empresas do usuário recuperadas com sucesso'
    });
  };

  inviteUser = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    const inviterId = this.getUserFromRequest(req)?.user_id;
    
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.inviteUser.bind(this.authService),
      serviceArgs: [companyId, inviterId],
      successMessage: 'Convite enviado com sucesso',
      dtoClass: InviteUserDto,
      validateDto: true
    });
  };

  acceptInvite = async (req: Request, res: Response): Promise<void> => {
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.acceptInvite.bind(this.authService),
      successMessage: 'Convite aceito com sucesso',
      successStatus: 201,
      dtoClass: AcceptInviteDto,
      validateDto: true
    });
  };

  revokeAccess = async (req: Request, res: Response): Promise<void> => {
    const companyId = this.getCompanyIdFromRequest(req);
    
    await this.handleRequest(req, res, {
      serviceMethod: this.authService.revokeAccess.bind(this.authService),
      serviceArgs: [companyId],
      successMessage: 'Acesso revogado com sucesso',
      dtoClass: RevokeAccessDto,
      validateDto: true
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    // Em uma implementação real, aqui seria invalidado o token no servidor
    // Por enquanto, apenas retornamos sucesso
    res.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });
  };

  validateToken = async (req: Request, res: Response): Promise<void> => {
    const user = this.getUserFromRequest(req);
    
    res.json({
      success: true,
      message: 'Token válido',
      data: {
        user_id: user.user_id,
        email: user.email,
        companies: user.companies
      }
    });
  };
}

