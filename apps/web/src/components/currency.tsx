import { appConfig } from '../app-config';

export function Currency({ value }: { value: number | string }) {
  return `${appConfig.currencySymbol} ${value}`;
}
