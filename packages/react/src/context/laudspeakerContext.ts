import { createContext, useState } from 'react';
import { Laudspeaker } from '@laudspeaker/laudspeaker-js';
import { TrackerState } from '@root/hooks/useTracker';

interface LaudspeakerContextState {
  laudspeaker: Laudspeaker;
  trackerData: [
    Record<string, TrackerState>,
    (value: Record<string, TrackerState>) => void
  ];
}

const initialValue: LaudspeakerContextState = {
  laudspeaker: new Laudspeaker(),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  trackerData: [{}, () => {}],
};

export const LaudspeakerContext =
  createContext<LaudspeakerContextState>(initialValue);
