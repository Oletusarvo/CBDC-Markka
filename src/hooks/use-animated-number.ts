import { useEffect, useState } from 'react';

export function useAnimatedNumber(targetValue: number, updateSpeed = 0, rounding = false) {
  const [currentValue, setCurrentValue] = useState(0);
  useEffect(() => {
    //Increment the currentValue until it equals the targetValue.
    const interval = setInterval(() => {
      setCurrentValue(prev => {
        let newValue = prev;
        const smoothing = 0.25;
        const step = Math.abs(prev - targetValue) * smoothing;
        if (prev < targetValue) {
          newValue = step > 0.1 ? newValue + step : targetValue;
        } else if (prev > targetValue) {
          newValue = step > 0.1 ? newValue - step : targetValue;
        } else {
          clearInterval(interval);
        }

        return newValue;
      });
    }, updateSpeed);
  }, [targetValue]);

  return rounding ? Math.trunc(currentValue) : currentValue;
}
