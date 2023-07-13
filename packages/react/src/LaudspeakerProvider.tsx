import React, { FC, ReactNode } from 'react';
import { LaudspeakerContext } from './context/laudspeakerContext';

interface LaudspeakerProviderProps {
  children: ReactNode;
  apiKey: string;
}

const LaudspeakerProvider: FC<LaudspeakerProviderProps> = ({
  children,
  apiKey,
}) => {
  return (
    <LaudspeakerContext.Provider value={{ apiKey }}>
      {children}
    </LaudspeakerContext.Provider>
  );
};

export default LaudspeakerProvider;
