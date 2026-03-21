export abstract class Core {
  static readonly COIN = 100_000_000;
  static amountToString(amount: number, signDisplay: 'always' | 'never' = 'never') {
    return Number(amount).toLocaleString('fi', {
      maximumFractionDigits: 8,
      minimumFractionDigits: 2,
      signDisplay,
    });
  }

  static convertCurrencyAmount(amountInCents: number) {
    return amountInCents / Core.COIN;
  }
}
