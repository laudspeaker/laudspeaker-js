import { createContext } from 'react';

interface LaudspeakerContextState {
  apiKey: string;
}

const initialValue: LaudspeakerContextState = {
  apiKey: '',
};

export const LaudspeakerContext =
  createContext<LaudspeakerContextState>(initialValue);
