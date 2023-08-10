import { createContext } from 'react';
import { Laudspeaker } from '@laudspeaker/laudspeaker-js';

interface LaudspeakerContextState {
  laudspeaker: Laudspeaker;
}

const initialValue: LaudspeakerContextState = {
  laudspeaker: new Laudspeaker(),
};

export const LaudspeakerContext =
  createContext<LaudspeakerContextState>(initialValue);
