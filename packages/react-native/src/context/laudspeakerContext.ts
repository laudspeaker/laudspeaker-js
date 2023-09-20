import { createContext } from 'react';
import { Laudspeaker } from '@laudspeaker/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TrackerState } from '@root/hooks/useTracker';

interface LaudspeakerContextState {
  laudspeaker: Laudspeaker;
  trackerData: [
    Record<string, TrackerState>,
    (value: Record<string, TrackerState>) => void
  ];
}

const initialValue: LaudspeakerContextState = {
  laudspeaker: new Laudspeaker(AsyncStorage),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  trackerData: [{}, () => {}],
};

export const LaudspeakerContext =
  createContext<LaudspeakerContextState>(initialValue);
