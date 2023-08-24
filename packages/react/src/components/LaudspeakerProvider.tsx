import React, { FC, ReactNode, useEffect, useState } from 'react';
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
  const trackerData = useState({});

  useEffect(() => {
    laudspeaker.init(apiKey, { apiHost });

    return () => {
      laudspeaker.disconnect();
    };
  }, []);

  return (
    <LaudspeakerContext.Provider value={{ laudspeaker, trackerData }}>
      {children}
    </LaudspeakerContext.Provider>
  );
};

export default LaudspeakerProvider;
