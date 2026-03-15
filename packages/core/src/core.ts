export abstract class Core {
  static readonly COIN = 10_000;
  static amountToString(amount: number, signDisplay: 'always' | 'never' = 'never') {
    return Number(amount).toLocaleString('fi', {
      maximumFractionDigits: 4,
      minimumFractionDigits: 4,
      signDisplay,
    });
  }

  static convertCurrencyAmount(amountInCents: number) {
    return amountInCents / Core.COIN;
  }
}
