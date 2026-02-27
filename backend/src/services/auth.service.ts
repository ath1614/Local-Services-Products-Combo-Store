import { User, UserRole } from '../models/User';
import { signToken } from '../utils/jwt';

interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  async register(dto: RegisterDTO) {
    const exists = await User.findOne({ email: dto.email });
    if (exists) throw new Error('Email already registered');

    const user = await User.create(dto);
    const token = signToken(user.id, user.role);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  async login(dto: LoginDTO) {
    const user = await User.findOne({ email: dto.email }).select('+password');
    if (!user || !(await user.comparePassword(dto.password))) {
      throw new Error('Invalid email or password');
    }
    const token = signToken(user.id, user.role);
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }
}
