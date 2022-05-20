import { useEffect, useState } from 'react';

const SwapStatus = ({ isSwapInProgress, participation }: any) => {
  const [participationInfo, setParticipationInfo] = useState();
  useEffect(() => {
    // clean participation data and save to state
    // setParticipationInfo
  }, [participation]);

  return (
    <>
      <h2>Swaps status</h2>
      {!isSwapInProgress && (
        <p>There's currently no swap in progress! Come back soon :)</p>
      )}
      {participation && (
        <>
          <p>Here's your latest swap info</p>
          {participationInfo}
        </>
      )}
    </>
  );
};

export default SwapStatus;
