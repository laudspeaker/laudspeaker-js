import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext } from 'react';

const useTracker = () => {
  const context = useContext(LaudspeakerContext);
};

export default useTracker;
