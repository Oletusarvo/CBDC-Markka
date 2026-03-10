import { useAccount } from '@cbdc-markka/utils-react';
import { appConfig } from '../app-config';
import { Input } from './input';

export function Currency({ value }: { value: number | string }) {
  return `${appConfig.currencySymbol} ${value}`;
}

export function CurrencySymbol() {
  return (
    <svg>
      <defs id='defs1'>
        <rect
          x='-0.076566443'
          y='-0.15313289'
          width='48.236858'
          height='48.00716'
          id='rect7'
        />
      </defs>
      <g
        id='layer1'
        transform='translate(-114.54368,-140.44353)'>
        <path
          id='text7'
          d='M 0.802736,2.5806097 V 10.766275 H 1.9747023 V 4.3969733 L 4.5174232,7.5612417 H 4.7342831 L 7.2539338,4.3969733 V 6.8809407 H 5.8751047 V 7.6928913 H 7.2539338 V 8.1449774 H 5.8751047 V 8.9572621 H 7.2539338 V 10.766275 H 8.4316677 V 8.9572621 h 1.36268 V 8.1449774 h -1.36268 V 7.6928913 h 1.36268 V 6.8809407 h -1.36268 V 2.5806097 H 7.3419851 L 4.6289292,5.9440232 1.9043382,2.5806097 Z'
          transform='matrix(1.3439786,0,0,1.5465686,113.46482,136.45244)'
        />
      </g>
    </svg>
  );
}

export function CurrencyAmountInput({ value, onInput, max }) {
  return (
    <Input
      iconComponent={props => <div {...props}>{appConfig.currencySymbol}</div>}
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
