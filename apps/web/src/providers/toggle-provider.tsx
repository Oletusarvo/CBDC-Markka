import { useState } from 'react';
import { setupContext } from '../util/setup-context';
import { PassProps } from '../components/pass-props';

const [ToggleContext, useToggleContext] = setupContext<{
  toggled: boolean;
  toggle: (state?: boolean) => void;
}>('ToggleContext');

export function ToggleProvider({ children }: React.PropsWithChildren) {
  const [toggled, setToggled] = useState(false);
  const toggle = (state?: boolean) => {
    if (typeof state !== 'undefined') {
      setToggled(state);
    } else {
      setToggled(prev => !prev);
    }
  };
  return <ToggleContext.Provider value={{ toggle, toggled }}>{children}</ToggleContext.Provider>;
}

ToggleProvider.Trigger = function ({ children }: React.PropsWithChildren) {
  const { toggle } = useToggleContext();
  return <PassProps onClick={() => toggle()}>{children}</PassProps>;
};

ToggleProvider.Target = function ({ children }: React.PropsWithChildren) {
  const { toggled } = useToggleContext();
  return toggled ? children : null;
};
