import { registerUserCredentialsSchema } from '@cbdc-markka/schemas';
import { db } from '../db-config';
import { UserRepository } from '../repositories/user-repository';
import { DBContext } from '../types/db-context';
import { hashPassword } from '../utils/password';
import { Repository } from '../utils/repository';
import z from 'zod';
import { Knex } from 'knex';
import { tablenames } from '../tablenames';

class UserService {
  constructor(private repo: UserRepository) {}
  async create(data: z.infer<typeof registerUserCredentialsSchema>, ctx: DBContext) {
    const hashedPassword = await hashPassword(data.password);
    return await this.repo
      .create(
        {
          ...data,
          password: hashedPassword,
          user_status_id: db
            .select('id')
            .from('user_status_type')
            .where({ label: 'pending' })
            .limit(1),
        },
        ctx,
      )
      .returning('*');
  }

  findById(id: string, ctx: DBContext) {
    return this.repo.findById(id, ctx);
  }

  activateUser(id: string, ctx: DBContext) {
    return this.repo
      .updateById(
        id,
        {
          user_status_id: db
            .select('id')
            .from('user_status_type')
            .where({ label: 'active' })
            .limit(1),
        },
        ctx,
      )
      .where({
        id,
        user_status_id: db
          .select('id')
          .from('user_status_type')
          .where({ label: 'pending' })
          .limit(1),
      })
      .returning('id');
  }
}

export const userService = new UserService(new UserRepository());
