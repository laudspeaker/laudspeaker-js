import { LaudspeakerContext } from '@root/context/laudspeakerContext';
import { useContext } from 'react';

const useLaudspeaker = () => {
  const { laudspeaker } = useContext(LaudspeakerContext);

  return laudspeaker;
};

export default useLaudspeaker;
