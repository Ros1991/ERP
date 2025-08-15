import { LoginDto, RegisterDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto, LoginResponseDto } from '../dtos/AuthDto';
import { UserService } from './UserService';
import { JwtTokenService } from './JwtTokenService';
import { UserRepository } from '../repositories/UserRepository';
import { User } from '../entities/User';
import { AppError } from '../core/errors/AppError';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as crypto from 'crypto';

export class AuthService {
  private userService: UserService;
  private jwtTokenService: JwtTokenService;
  private userRepository: UserRepository;

  constructor() {
    this.userService = new UserService();
    this.jwtTokenService = new JwtTokenService();
    this.userRepository = new UserRepository();
  }

  /**
   * Register new user
   */
  async register(registerDto: RegisterDto): Promise<LoginResponseDto> {
    const { nome, email, password } = registerDto;

    // Check if user already exists
    const existingUser = await this.userService.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email já está em uso', 409);
    }

    // Create new user
    const createUserDto = {
      nome,
      email,
      password
    };

    const userDto = await this.userService.create(createUserDto);
    
    // Convert DTO to User entity for token generation
    const user = new User();
    user.userId = (userDto as any).userId;
    user.email = (userDto as any).email;
    user.nome = (userDto as any).nome;
    user.createdAt = (userDto as any).createdAt;
    user.updatedAt = (userDto as any).updatedAt;

    // Generate JWT token
    const token = this.generateJWT(user);
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    // Store JWT token in database
    await this.storeJwtToken(user.userId, token);

    // Return login response
    const loginResponse: LoginResponseDto = {
      user: {
        userId: user.userId,
        email: user.email,
        nome: user.nome
      },
      token,
      expiresIn
    };

    return loginResponse;
  }

  /**
   * Login user and generate JWT token
   */
  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    // Verify user credentials using UserService method
    const user = await this.userService.verifyPassword(email, password);
    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    // Generate JWT token
    const token = this.generateJWT(user);
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';

    // Store JWT token in database
    await this.storeJwtToken(user.userId, token);

    // Return login response
    const loginResponse: LoginResponseDto = {
      user: {
        userId: user.userId,
        email: user.email,
        nome: user.nome
      },
      token,
      expiresIn
    };

    return loginResponse;
  }

  /**
   * Logout user (invalidate token)
   */
  async logout(token: string): Promise<void> {
    try {
      // Decode token to get user info
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Find and invalidate the token
      const jwtTokens = await this.jwtTokenService.findWithPagination({
        page: 1,
        limit: 100,
        search: { userId: decoded.userId }
      });

      // Mark matching token as expired (soft delete approach)
      for (const jwtToken of jwtTokens.items) {
        const tokenData = jwtToken as any;
        const isMatchingToken = await bcrypt.compare(token, tokenData.tokenHash);
        if (isMatchingToken) {
          await this.jwtTokenService.delete(tokenData.tokenId);
          break;
        }
      }
    } catch (error) {
      // Token might be invalid, but logout should still succeed
      console.log('Logout warning:', error);
    }
  }

  /**
   * Initiate forgot password process
   */
  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string; success: boolean }> {
    const { email } = forgotPasswordDto;

    // Check if user exists
    const userDto = await this.userService.findByEmail(email);
    if (!userDto) {
      // Don't reveal if email exists or not for security
      return {
        message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.',
        success: true
      };
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(resetToken, 10);
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1); // 1 hour expiration

    // Set reset token for user
    await this.userRepository.setResetToken((userDto as any).userId, tokenHash, expirationDate);

    // TODO: Send email with reset token (implement email service)
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return {
      message: 'Se o email existir em nosso sistema, você receberá instruções para redefinir sua senha.',
      success: true
    };
  }

  /**
   * Reset password using token
   */
  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string; success: boolean }> {
    const { token, newPassword } = resetPasswordDto;

    // Get all users with reset tokens (we need to compare hashes manually)
    const allUsers = await this.userService.findWithPagination({
      page: 1,
      limit: 100,
      search: {}
    });

    let validUser = null;
    for (const userData of allUsers.items) {
      const user = userData as any;
      if (user.resetTokenHash && user.resetTokenExpires) {
        // Check if token matches and is not expired
        const isTokenValid = await bcrypt.compare(token, user.resetTokenHash);
        const isNotExpired = new Date(user.resetTokenExpires) > new Date();
        
        if (isTokenValid && isNotExpired) {
          validUser = user;
          break;
        }
      }
    }
    
    if (!validUser) {
      throw new AppError('Token inválido ou expirado', 400);
    }

    // Update user password
    await this.userService.update(validUser.userId, { password: newPassword });

    // Clear reset token
    await this.userRepository.clearResetToken(validUser.userId);

    return {
      message: 'Senha redefinida com sucesso',
      success: true
    };
  }

  /**
   * Change password for authenticated user
   */
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string; success: boolean }> {
    const { currentPassword, newPassword } = changePasswordDto;

    // Verify current password using UserService method
    const userDto = await this.userService.findById(userId);
    if (!userDto) {
      throw new AppError('Usuário não encontrado', 404);
    }

    // Use UserService's verifyPassword method to check current password
    const user = await this.userService.verifyPassword((userDto as any).email, currentPassword);
    if (!user) {
      throw new AppError('Senha atual incorreta', 400);
    }

    // Update to new password
    await this.userService.update(userId, { password: newPassword });

    return {
      message: 'Senha alterada com sucesso',
      success: true
    };
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      
      // Get user using service method
      const userDto = await this.userService.findById(decoded.userId);
      if (!userDto) {
        return null;
      }

      // Convert DTO back to entity (simplified approach)
      const user = new User();
      user.userId = (userDto as any).userId;
      user.email = (userDto as any).email;
      user.nome = (userDto as any).nome;
      user.isDeleted = (userDto as any).isDeleted;
      user.createdAt = (userDto as any).createdAt;
      user.updatedAt = (userDto as any).updatedAt;
      
      if (user.isDeleted) {
        return null;
      }

      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Generate JWT token
   */
  private generateJWT(user: User): string {
    const payload = {
      userId: user.userId,
      email: user.email,
      nome: user.nome
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError('JWT_SECRET não configurado', 500);
    }

    const options: jwt.SignOptions = {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    } as jwt.SignOptions;
    
    return jwt.sign(payload, secret, options);
  }

  /**
   * Store JWT token in database
   */
  private async storeJwtToken(userId: number, token: string): Promise<void> {
    const tokenHash = await bcrypt.hash(token, 10);
    const expirationDate = new Date();
    
    // Parse expiration time (default 24h)
    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const hours = parseInt(expiresIn.replace('h', '')) || 24;
    expirationDate.setHours(expirationDate.getHours() + hours);

    const createTokenDto = {
      userId,
      tokenHash,
      expirationDate
    };

    await this.jwtTokenService.create(createTokenDto);
  }
}
