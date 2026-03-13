import { useAccount } from '@cbdc-markka/utils-react';
import { appConfig } from '../util/app-config';
import { Input } from './input';

export function Currency({ value }: { value: number | string }) {
  return `${appConfig.currencySymbol} ${value}`;
}

export function CurrencySymbol({
  size = 24,
  color = 'currentColor',
  strokeWidth = '0.529167',
  ...props
}: {
  size?: number | string;
  color?: string;
  strokeWidth?: number | string;
}) {
  const pathStrokeWidth = strokeWidth;
  return (
    <svg
      width={size}
      height={size}
      viewBox='0 0 6.3499998 6.35'
      fill='none'
      strokeWidth={strokeWidth}
      stroke={color}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}>
      <path
        d='M0.80191201,5.5603853 V0.78789233 L2.8564109,2.1319199 4.8057629,0.78789233 V5.5603853'
        strokeWidth={pathStrokeWidth}
      />
      <path
        d='M3.9647276,3.4313696 H5.5990285'
        strokeWidth={pathStrokeWidth}
      />
      <path
        d='M3.9792323,4.4352036 H5.5990285'
        strokeWidth={pathStrokeWidth}
      />
    </svg>
  );
}

export function CurrencyAmountInput({ value, onInput, max }) {
  return (
    <Input
      fontWeight={600}
      iconComponent={CurrencySymbol}
      fullWidth
      value={value}
      onInput={onInput}
      name='amt'
      type='number'
      step={0.01}
      min={0.01}
      max={max}
      placeholder='Määrä...'
      required
    />
  );
}
