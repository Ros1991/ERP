import { BaseController } from '@/core/base/BaseController';
import { User } from '@/entities/User';
import { UserService } from '@/services/UserService';
import { UserMapper } from '@/mappers/UserMapper';

export class UserController extends BaseController<User> {
  private userService: UserService;

  constructor() {
    super(User, UserMapper);
    this.userService = new UserService();
    this.service = this.userService;
  }
}

