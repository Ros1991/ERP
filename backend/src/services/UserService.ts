import { BaseService } from '@/core/base/BaseService';
import { User } from '@/entities/User';
import { UserRepository } from '@/repositories/UserRepository';
import { UserMapper } from '@/mappers/UserMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';
import * as bcrypt from 'bcryptjs';

export class UserService extends BaseService<User> {
  private userRepository: UserRepository;

  constructor() {
    const userRepository = new UserRepository();
    const userMapper = new UserMapper();
    super(User, UserMapper, 'User');
    this.userRepository = userRepository;
    this.baseMapper = userMapper;
    this.repository = userRepository;
  }

  /**
   * Validate before creating user
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    const dto = createDto as any;
    
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError('Email já está em uso', 409);
    }
  }

  /**
   * Validate before updating user
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: User): Promise<void> {
    const dto = updateDto as any;
    
    // Check if email already exists (excluding current user)
    if (dto.email && dto.email !== existingEntity.email) {
      const emailExists = await this.userRepository.emailExists(dto.email, id);
      if (emailExists) {
        throw new AppError('Email já está em uso', 409);
      }
    }
  }

  /**
   * Hash password before creating user
   */
  protected async afterCreate(entity: User): Promise<void> {
    // Password is already hashed in the create method
  }

  /**
   * Create user with hashed password
   */
  async create(createDto: IDto): Promise<IDto> {
    await this.validateBeforeCreate(createDto);
    
    const dto = createDto as any;
    // Hash password before saving
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    
    const entityData = this.baseMapper.toEntity(dto);
    const entity = await this.repository.create(entityData as any);
    await this.afterCreate(entity);
    return this.baseMapper.toResponseDto(entity);
  }

  /**
   * Update user with optional password hashing
   */
  async update(id: number, updateDto: IDto): Promise<IDto> {
    const existingEntity = await this.repository.findById(id);
    if (!existingEntity) {
      throw new AppError(`${this.entityName} with id ${id} not found`, 404);
    }
    
    await this.validateBeforeUpdate(id, updateDto, existingEntity);
    
    const dto = updateDto as any;
    // Hash password if provided
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }
    
    const entityData = this.baseMapper.toEntityFromUpdate(dto, existingEntity);
    const entity = await this.repository.update(id, entityData as any);
    if (!entity) {
      throw new AppError(`Failed to update ${this.entityName} with id ${id}`, 500);
    }
    await this.afterUpdate(entity);
    return this.baseMapper.toResponseDto(entity);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<IDto | null> {
    const entity = await this.userRepository.findByEmail(email);
    if (!entity) {
      return null;
    }
    return this.baseMapper.toResponseDto(entity);
  }

  /**
   * Verify user password
   */
  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}

