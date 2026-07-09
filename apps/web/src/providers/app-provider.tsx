import { setupContext } from '@cbdc-markka/utils-react';
import { useState } from 'react';

const [AppContext, useAppContext] = setupContext<{
  selectedLanguage: 'fi' | 'en';
  updateLanguage: (lang: 'fi' | 'en') => void;
}>('AppContext');

export function AppProvider({ children }: React.PropsWithChildren) {
  const [selectedLanguage, setSelectedLanguage] = useState<'fi' | 'en'>('fi');
  const updateLanguage = (lang: 'fi' | 'en') => setSelectedLanguage(lang);
  return (
    <AppContext.Provider value={{ selectedLanguage, updateLanguage }}>
      {children}
    </AppContext.Provider>
  );
}

export { useAppContext };
