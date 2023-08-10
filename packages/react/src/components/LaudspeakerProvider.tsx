import React, { FC, ReactNode, useEffect } from 'react';
import { LaudspeakerContext } from '../context/laudspeakerContext';
import laudspeaker from '@laudspeaker/laudspeaker-js';

interface LaudspeakerProviderProps {
  children: ReactNode;
  apiKey: string;
  apiHost?: string;
}

const LaudspeakerProvider: FC<LaudspeakerProviderProps> = ({
  children,
  apiKey,
  apiHost,
}) => {
  useEffect(() => {
    laudspeaker.init(apiKey, { apiHost });

    return () => {
      laudspeaker.disconnect();
    };
  }, []);

  return (
    <LaudspeakerContext.Provider value={{ laudspeaker }}>
      {children}
    </LaudspeakerContext.Provider>
  );
};

export default LaudspeakerProvider;
