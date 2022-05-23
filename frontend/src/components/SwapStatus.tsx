import { useEffect, useState } from 'react';

const SwapStatus = ({
  isSwapInProgress,
  participation,
  userAddress,
  luckyNftSwapContract
}: any) => {
  const [participationInfo, setParticipationInfo] = useState();
  const [finalSwapInfo, setFinalSwapInfo] = useState();

  useEffect(() => {
    const getParticipationInfo = async () => {
      if (participation) {
        try {
          const [address, tokenId] =
            await luckyNftSwapContract.getOriginalDeposit(userAddress);
          console.log(address, tokenId);
          setParticipationInfo(address);
        } catch (error: any) {
          console.log(error.message);
        }
      } else console.log('User has not participated in this swap');
    };
    getParticipationInfo();
  }, [participation]);

  useEffect(() => {
    const getFinalSwapInfo = async () => {
      if (!isSwapInProgress) {
        try {
          const [address, tokenId] =
            await luckyNftSwapContract.getDepositAfterShift(userAddress);
          console.log(address, tokenId);
          setFinalSwapInfo(address);
        } catch (error: any) {
          console.log(error.message);
        }
      }
    };
    getFinalSwapInfo();
  }, [isSwapInProgress]);

  return (
    <>
      <h2>Swaps status</h2>
      {!isSwapInProgress && (
        <p>There's currently no swap in progress! Come back soon :)</p>
      )}
      {participation && (
        <>
          <p>Here's the latest NFT you added to the pool:</p>
          {participationInfo}
        </>
      )}
      {participation && finalSwapInfo && (
        <>
          <p>And here's your latest lucky swap!</p>
          {finalSwapInfo}
        </>
      )}
    </>
  );
};

export default SwapStatus;
