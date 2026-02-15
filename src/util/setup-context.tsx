import { createContext, useContext } from 'react';

export function setupContext<T>(contextName: string) {
  const Ctx = createContext<T | null>(null);
  const hook = () => {
    const ctx = useContext(Ctx);
    if (!ctx) {
      throw new Error(`use${contextName} must be used within the scope of a ${contextName}!`);
    }
    return ctx;
  };

  return [Ctx, hook] as const;
}
