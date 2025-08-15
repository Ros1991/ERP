import { BaseService } from '@/core/base/BaseService';
import { JwtToken } from '@/entities/JwtToken';
import { JwtTokenRepository } from '@/repositories/JwtTokenRepository';
import { JwtTokenMapper } from '@/mappers/JwtTokenMapper';
import { IDto } from '@/core/base/BaseDto';
import { AppError } from '@/core/errors/AppError';

export class JwtTokenService extends BaseService<JwtToken> {
  private jwttokenRepository: JwtTokenRepository;

  constructor() {
    const jwttokenRepository = new JwtTokenRepository();
    const jwttokenMapper = new JwtTokenMapper();
    super(JwtToken, JwtTokenMapper, 'JwtToken');
    this.jwttokenRepository = jwttokenRepository;
    this.baseMapper = jwttokenMapper;
    this.repository = jwttokenRepository;
  }

  /**
   * Validate before creating jwttoken
   */
  protected async validateBeforeCreate(createDto: IDto): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before updating jwttoken
   */
  protected async validateBeforeUpdate(id: number, updateDto: IDto, existingEntity: JwtToken): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Validate before deleting jwttoken
   */
  protected async validateBeforeDelete(id: number, entity: JwtToken): Promise<void> {
    // Add specific validation logic here
  }

  /**
   * Override create to handle JwtToken without updatedAt column
   */
  async create(createDto: IDto): Promise<IDto> {
    await this.validateBeforeCreate(createDto);
    const entityData = this.baseMapper.toEntity(createDto);
    const entity = await this.jwttokenRepository.create(entityData as any);
    await this.afterCreate(entity);
    return this.baseMapper.toResponseDto(entity);
  }
}
