import { Knex } from 'knex';
import { db } from '../db-config';
import { tablenames } from '../tablenames';
import { DBContext } from '../types/db-context';
import { Repository } from '../utils/repository';

type TUser = { email: string; password: string; user_status_id: Knex.QueryBuilder | number };
export class UserRepository extends Repository<TUser> {
  constructor() {
    super(tablenames.users, (tablename, ctx) => {
      return ctx({ users: tablename })
        .join(
          db.raw('?? as user_status_type ON user_status_type.id = users.user_status_id', [
            'user_status_type',
          ]),
        )
        .select('users.*', 'user_status_type.label as status');
    });
  }

  create(data: TUser, ctx: DBContext) {
    return super.create(data, ctx);
  }

  updateById(id: string, data: any, ctx: DBContext) {
    return ctx(this.tablename).where({ id }).update(data);
  }
}
