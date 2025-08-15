import { BaseController } from '@/core/base/BaseController';
import { JwtToken } from '@/entities/JwtToken';
import { JwtTokenService } from '@/services/JwtTokenService';
import { JwtTokenMapper } from '@/mappers/JwtTokenMapper';

export class JwtTokenController extends BaseController<JwtToken> {
  private jwttokenService: JwtTokenService;

  constructor() {
    super(JwtToken, JwtTokenMapper);
    this.jwttokenService = new JwtTokenService();
    this.service = this.jwttokenService;
  }
}
