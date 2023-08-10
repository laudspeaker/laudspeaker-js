import { createContext } from 'react';
import { Laudspeaker } from '@laudspeaker/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LaudspeakerContextState {
  laudspeaker: Laudspeaker;
}

const initialValue: LaudspeakerContextState = {
  laudspeaker: new Laudspeaker(AsyncStorage),
};

export const LaudspeakerContext =
  createContext<LaudspeakerContextState>(initialValue);
