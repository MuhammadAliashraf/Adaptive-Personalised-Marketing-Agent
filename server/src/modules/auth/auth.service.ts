import { ConflictError, UnauthorizedError } from '@common/errors';
import { comparePassword, hashPassword } from '@common/utils/password';
import {
  JwtPayload,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '@common/utils/jwt';
import { Marketer } from './auth.entity';
import { authRepository } from './auth.repository';
import { LoginInput, RefreshInput, RegisterInput } from './auth.schema';

type SafeMarketer = Omit<Marketer, 'passwordHash'>;

interface AuthResult {
  marketer: SafeMarketer;
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    if (await authRepository.existsByEmail(input.email)) {
      throw new ConflictError('A marketer with this email already exists');
    }

    const passwordHash = await hashPassword(input.password);
    const entity = authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });
    const saved = await authRepository.save(entity);
    return this.buildAuthResult(saved);
  }

  async login(input: LoginInput): Promise<AuthResult> {
    const marketer = await authRepository.findByEmailWithPassword(input.email);
    if (!marketer) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const valid = await comparePassword(input.password, marketer.passwordHash);
    if (!valid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return this.buildAuthResult(marketer);
  }

  async refresh(input: RefreshInput): Promise<{ accessToken: string; refreshToken: string }> {
    let payload: JwtPayload;
    try {
      payload = verifyRefreshToken(input.refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const marketer = await authRepository.findById(payload.sub);
    if (!marketer) {
      throw new UnauthorizedError('Marketer no longer exists');
    }

    const tokenPayload = this.toPayload(marketer);
    return {
      accessToken: signAccessToken(tokenPayload),
      refreshToken: signRefreshToken(tokenPayload),
    };
  }

  async getProfile(id: string): Promise<SafeMarketer> {
    const marketer = await authRepository.findById(id);
    if (!marketer) {
      throw new UnauthorizedError('Marketer no longer exists');
    }
    return this.sanitize(marketer);
  }

  private buildAuthResult(marketer: Marketer): AuthResult {
    const payload = this.toPayload(marketer);
    return {
      marketer: this.sanitize(marketer),
      accessToken: signAccessToken(payload),
      refreshToken: signRefreshToken(payload),
    };
  }

  private toPayload(marketer: Marketer): JwtPayload {
    return { sub: marketer.id, email: marketer.email, role: marketer.role };
  }

  private sanitize(marketer: Marketer): SafeMarketer {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...safe } = marketer;
    return safe;
  }
}

export const authService = new AuthService();
