import { useEffect, useState } from 'react';

const SwapStatus = ({
  isSwapInProgress,
  participation,
  userAddress,
  luckyNftSwapContract
}: any) => {
  const [participationInfo, setParticipationInfo] = useState();

  useEffect(() => {
    const getParticipationInfo = async () => {
      if (participation) {
        try {
          const originalDeposit = await luckyNftSwapContract.getOriginalDeposit(
            userAddress
          );
          console.log({ originalDeposit });
          setParticipationInfo(originalDeposit);
        } catch (error: any) {
          console.log(error.message);
        }
      } else console.log('User has not participated in this swap');
    };
    getParticipationInfo();
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
          {JSON.stringify(participationInfo)}
        </>
      )}
    </>
  );
};

export default SwapStatus;
