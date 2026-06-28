import { DBContext } from '../types/db-context';

class MintingService {
  /**Mints new coins. Returns 0 if the amount cannot be minted. Decrements the supply-table on succesful mint. */
  async mint(amountInCents: number, ctx: DBContext) {
    const amt = Math.trunc(amountInCents);
    const supplyRowsAffected = await ctx('supply')
      .where('unreleased_supply', '>=', amt)
      .decrement('unreleased_supply', amt)
      .forUpdate()
      .limit(1);

    return supplyRowsAffected === 1 ? amountInCents : 0;
  }
}

export const mintingService = new MintingService();
