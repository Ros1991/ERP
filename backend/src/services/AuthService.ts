import { BaseService } from './BaseService';
import { User } from '../entities/User';
import { Company } from '../entities/Company';
import { CompanyMember } from '../entities/CompanyMember';
import { Role } from '../entities/Role';
import { UserRepository } from '../repositories/UserRepository';
import { CompanyRepository } from '../repositories/CompanyRepository';
import { CompanyMemberRepository } from '../repositories/CompanyMemberRepository';
import { RoleRepository } from '../repositories/RoleRepository';
import { PasswordUtils } from '../utils/password';
import { JwtUtils, JwtPayload } from '../utils/jwt';
import { AppError } from '../utils/AppError';
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
  AuthResponseDto,
  InviteUserDto,
  AcceptInviteDto,
  RevokeAccessDto
} from '../dtos/AuthDto';

export class AuthService extends BaseService<User, RegisterDto, UpdateProfileDto> {
  private companyRepository: CompanyRepository;
  private companyMemberRepository: CompanyMemberRepository;
  private roleRepository: RoleRepository;

  constructor() {
    const userRepository = new UserRepository();
    super(userRepository);
    this.companyRepository = new CompanyRepository();
    this.companyMemberRepository = new CompanyMemberRepository();
    this.roleRepository = new RoleRepository();
  }

  async register(data: RegisterDto): Promise<AuthResponseDto> {
    // Verificar se o email já existe
    const existingUser = await (this.repository as UserRepository).findByEmail(data.email);
    if (existingUser) {
      throw AppError.conflict('Email já está em uso');
    }

    // Validar e hash da senha
    PasswordUtils.validatePassword(data.password);
    const passwordHash = await PasswordUtils.hash(data.password);

    // Criar usuário
    const user = await this.repository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password_hash: passwordHash
    });

    // Criar empresa padrão para o usuário
    const company = await this.companyRepository.create({
      name: `Empresa de ${data.name}`,
      owner_id: user.id
    });

    // Criar roles padrão para a empresa
    const roles = await this.roleRepository.createDefaultRoles(company.id);
    const ownerRole = roles.find(role => role.name === 'Dono');

    if (!ownerRole) {
      throw AppError.internalServer('Erro ao criar perfil de proprietário');
    }

    // Adicionar usuário como membro da empresa com role de dono
    await this.companyMemberRepository.create({
      user_id: user.id,
      company_id: company.id,
      role_id: ownerRole.id
    });

    // Gerar tokens
    const userWithCompanies = await this.getUserWithCompanies(user.id);
    return this.generateAuthResponse(userWithCompanies);
  }

  async login(data: LoginDto): Promise<AuthResponseDto> {
    // Buscar usuário por email
    const user = await (this.repository as UserRepository).findByEmail(data.email);
    if (!user) {
      throw AppError.unauthorized('Email ou senha inválidos');
    }

    // Verificar senha
    const isPasswordValid = await PasswordUtils.compare(data.password, user.password_hash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Email ou senha inválidos');
    }

    // Buscar usuário com empresas
    const userWithCompanies = await this.getUserWithCompanies(user.id);
    return this.generateAuthResponse(userWithCompanies);
  }

  async facialLogin(data: FacialLoginDto): Promise<AuthResponseDto> {
    // Em uma implementação real, aqui seria feita a comparação biométrica
    // Por enquanto, vamos simular a busca por vetor facial
    const user = await (this.repository as UserRepository).findByFacialRecognitionVector(data.image_data);
    
    if (!user) {
      throw AppError.unauthorized('Reconhecimento facial falhou');
    }

    const userWithCompanies = await this.getUserWithCompanies(user.id);
    return this.generateAuthResponse(userWithCompanies);
  }

  async registerFace(userId: string, data: RegisterFaceDto): Promise<{ message: string }> {
    const user = await this.findById(userId);
    
    // Em uma implementação real, aqui seria processada a imagem e gerado o vetor biométrico
    // Por enquanto, vamos apenas salvar os dados da imagem
    await (this.repository as UserRepository).updateFacialRecognitionVector(userId, data.image_data);

    return { message: 'Reconhecimento facial registrado com sucesso' };
  }

  async removeFace(userId: string): Promise<{ message: string }> {
    await this.findById(userId);
    await (this.repository as UserRepository).removeFacialRecognitionVector(userId);

    return { message: 'Reconhecimento facial removido com sucesso' };
  }

  async refreshToken(data: RefreshTokenDto): Promise<AuthResponseDto> {
    try {
      const payload = JwtUtils.verifyRefreshToken(data.refresh_token);
      const userWithCompanies = await this.getUserWithCompanies(payload.user_id);
      return this.generateAuthResponse(userWithCompanies);
    } catch (error) {
      throw AppError.unauthorized('Refresh token inválido ou expirado');
    }
  }

  async changePassword(userId: string, data: ChangePasswordDto): Promise<{ message: string }> {
    const user = await this.findById(userId);

    // Verificar senha atual
    const isCurrentPasswordValid = await PasswordUtils.compare(data.current_password, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw AppError.badRequest('Senha atual incorreta');
    }

    // Validar nova senha
    PasswordUtils.validatePassword(data.new_password);

    // Verificar se a nova senha é diferente da atual
    const isSamePassword = await PasswordUtils.compare(data.new_password, user.password_hash);
    if (isSamePassword) {
      throw AppError.badRequest('A nova senha deve ser diferente da senha atual');
    }

    // Atualizar senha
    const newPasswordHash = await PasswordUtils.hash(data.new_password);
    await this.repository.update(userId, { password_hash: newPasswordHash });

    return { message: 'Senha alterada com sucesso' };
  }

  async forgotPassword(data: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await (this.repository as UserRepository).findByEmail(data.email);
    
    // Por segurança, sempre retornamos sucesso, mesmo se o email não existir
    if (user) {
      // Em uma implementação real, aqui seria enviado um email com token de reset
      // Por enquanto, vamos apenas simular
      console.log(`Reset password token for user ${user.id}: reset-token-${user.id}-${Date.now()}`);
    }

    return { message: 'Se o email existir, você receberá instruções para redefinir sua senha' };
  }

  async resetPassword(data: ResetPasswordDto): Promise<{ message: string }> {
    // Em uma implementação real, aqui seria validado o token de reset
    // Por enquanto, vamos simular a validação
    const tokenParts = data.token.split('-');
    if (tokenParts.length !== 4 || tokenParts[0] !== 'reset' || tokenParts[1] !== 'token') {
      throw AppError.badRequest('Token de reset inválido');
    }

    const userId = tokenParts[2];
    const user = await this.findById(userId);

    // Validar nova senha
    PasswordUtils.validatePassword(data.new_password);

    // Atualizar senha
    const newPasswordHash = await PasswordUtils.hash(data.new_password);
    await this.repository.update(userId, { password_hash: newPasswordHash });

    return { message: 'Senha redefinida com sucesso' };
  }

  async updateProfile(userId: string, data: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);

    // Verificar se o novo email já está em uso (se fornecido)
    if (data.email && data.email !== user.email) {
      const emailExists = await (this.repository as UserRepository).emailExists(data.email, userId);
      if (emailExists) {
        throw AppError.conflict('Email já está em uso');
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email.toLowerCase();

    return await this.repository.update(userId, updateData) as User;
  }

  async getProfile(userId: string): Promise<User> {
    return await this.findById(userId);
  }

  async getUserCompanies(userId: string): Promise<any[]> {
    const memberships = await this.companyMemberRepository.findByUserIdWithDetails(userId);
    
    return memberships.map(membership => ({
      company_id: membership.company.id,
      company_name: membership.company.name,
      role_id: membership.role.id,
      role_name: membership.role.name,
      permissions: membership.role.permissions
    }));
  }

  async inviteUser(companyId: string, inviterId: string, data: InviteUserDto): Promise<{ message: string }> {
    // Verificar se o convite é válido
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw AppError.notFound('Empresa não encontrada');
    }

    const role = await this.roleRepository.findByIdAndCompany(data.role_id, companyId);
    if (!role) {
      throw AppError.notFound('Perfil não encontrado');
    }

    // Verificar se o usuário já é membro da empresa
    const existingUser = await (this.repository as UserRepository).findByEmail(data.email);
    if (existingUser) {
      const isMember = await this.companyMemberRepository.membershipExists(existingUser.id, companyId);
      if (isMember) {
        throw AppError.conflict('Usuário já é membro desta empresa');
      }
    }

    // Em uma implementação real, aqui seria enviado um email de convite
    // Por enquanto, vamos apenas simular
    const inviteToken = `invite-${companyId}-${data.email}-${Date.now()}`;
    console.log(`Invite token: ${inviteToken}`);

    return { message: 'Convite enviado com sucesso' };
  }

  async acceptInvite(data: AcceptInviteDto): Promise<AuthResponseDto> {
    // Em uma implementação real, aqui seria validado o token de convite
    // Por enquanto, vamos simular a validação
    const tokenParts = data.invite_token.split('-');
    if (tokenParts.length !== 4 || tokenParts[0] !== 'invite') {
      throw AppError.badRequest('Token de convite inválido');
    }

    const companyId = tokenParts[1];
    const email = tokenParts[2];

    // Verificar se a empresa existe
    const company = await this.companyRepository.findById(companyId);
    if (!company) {
      throw AppError.notFound('Empresa não encontrada');
    }

    // Criar ou buscar usuário
    let user = await (this.repository as UserRepository).findByEmail(email);
    
    if (!user) {
      // Criar novo usuário
      PasswordUtils.validatePassword(data.password);
      const passwordHash = await PasswordUtils.hash(data.password);

      user = await this.repository.create({
        name: data.name,
        email: email.toLowerCase(),
        password_hash: passwordHash
      });
    }

    // Adicionar usuário à empresa (assumindo role padrão de Funcionário)
    const employeeRole = await this.roleRepository.findByCompanyIdAndName(companyId, 'Funcionário');
    if (!employeeRole) {
      throw AppError.internalServer('Perfil de funcionário não encontrado');
    }

    await this.companyMemberRepository.create({
      user_id: user.id,
      company_id: companyId,
      role_id: employeeRole.id
    });

    const userWithCompanies = await this.getUserWithCompanies(user.id);
    return this.generateAuthResponse(userWithCompanies);
  }

  async revokeAccess(companyId: string, data: RevokeAccessDto): Promise<{ message: string }> {
    const removed = await this.companyMemberRepository.removeMembership(data.user_id, companyId);
    
    if (!removed) {
      throw AppError.notFound('Usuário não é membro desta empresa');
    }

    return { message: 'Acesso revogado com sucesso' };
  }

  private async getUserWithCompanies(userId: string): Promise<any> {
    const user = await (this.repository as UserRepository).findByIdWithCompanies(userId);
    if (!user) {
      throw AppError.notFound('Usuário não encontrado');
    }

    const companies = user.company_memberships?.map(membership => ({
      company_id: membership.company.id,
      company_name: membership.company.name,
      role_id: membership.role.id,
      role_name: membership.role.name,
      permissions: membership.role.permissions
    })) || [];

    return { ...user, companies };
  }

  private async generateAuthResponse(userWithCompanies: any): Promise<AuthResponseDto> {
    const jwtPayload: JwtPayload = {
      user_id: userWithCompanies.id,
      email: userWithCompanies.email,
      companies: userWithCompanies.companies
    };

    const accessToken = JwtUtils.generateAccessToken(jwtPayload);
    const refreshToken = JwtUtils.generateRefreshToken({
      user_id: userWithCompanies.id,
      email: userWithCompanies.email
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: userWithCompanies.id,
        name: userWithCompanies.name,
        email: userWithCompanies.email,
        has_facial_recognition: !!userWithCompanies.facial_recognition_vector,
        created_at: userWithCompanies.created_at
      },
      companies: userWithCompanies.companies
    };
  }
}

