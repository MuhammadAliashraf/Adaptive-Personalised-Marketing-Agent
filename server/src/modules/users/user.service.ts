import { NotFoundError } from '@common/errors';
import { buildPaginationMeta, PaginationMeta } from '@common/utils/ApiResponse';
import { User } from './user.entity';
import { userRepository } from './user.repository';
import { ListUsersQuery } from './user.schema';

class UserService {
  async list(query: ListUsersQuery): Promise<{ items: User[]; meta: PaginationMeta }> {
    const { items, total } = await userRepository.findAndFilter(query);
    const meta = buildPaginationMeta(total, query.page ?? 1, query.limit ?? 20);
    return { items, meta };
  }

  async getById(id: string): Promise<User> {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /** Validates that every id resolves to a real user; used by campaign creation. */
  async getManyOrFail(ids: string[]): Promise<User[]> {
    const users = await userRepository.findByIds(ids);
    if (users.length !== ids.length) {
      const found = new Set(users.map((u) => u.id));
      const missing = ids.filter((id) => !found.has(id));
      throw new NotFoundError(`Unknown user ids: ${missing.join(', ')}`);
    }
    return users;
  }
}

export const userService = new UserService();
