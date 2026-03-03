import { TBill } from './currency-util';

export class TransactionManager {
  public readonly toUpdate: (TBill & { old_account_id: string })[] = [];
  public readonly toMint: Pick<TBill, 'account_id' | 'value_in_cents'>[] = [];
  private senderAccountId: string;
  private receiverAccountId: string;

  constructor(senderAccountId: string, receiverAccountId: string) {
    this.senderAccountId = senderAccountId;
    this.receiverAccountId = receiverAccountId;
  }

  updateCoinsToUpdate(toSender: TBill[] = [], toReceiver: TBill[] = [], toReserve: TBill[] = []) {
    this.toUpdate.push(
      ...toSender.map(t => {
        return {
          ...t,
          old_account_id: this.receiverAccountId,
          account_id: this.senderAccountId,
        };
      }),
      ...toReceiver.map(t => {
        return {
          ...t,
          old_account_id: this.senderAccountId,
          account_id: this.receiverAccountId,
        };
      }),
      ...toReserve.map(t => {
        return {
          ...t,
          account_id: null,
          old_account_id: this.senderAccountId,
        };
      }),
    );
  }

  updateCoinsToMint(
    toSender: Pick<TBill, 'value_in_cents'>[] = [],
    toReceiver: Pick<TBill, 'value_in_cents'>[] = [],
  ) {
    this.toMint.push(
      ...toSender.map(t => {
        return {
          value_in_cents: t.value_in_cents,
          account_id: this.senderAccountId,
        };
      }),
      ...toReceiver.map(t => {
        return {
          value_in_cents: t.value_in_cents,
          account_id: this.receiverAccountId,
        };
      }),
    );
  }

  mint(amountInCents: number) {}
}
