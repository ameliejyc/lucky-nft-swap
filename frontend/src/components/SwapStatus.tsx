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
      if (participation && luckyNftSwapContract) {
        try {
          const [address, tokenId] =
            await luckyNftSwapContract.getOriginalDeposit(userAddress);
          setParticipationInfo(address);
        } catch (error: any) {
          console.log(error.message);
        }
      }
    };
    getParticipationInfo();
  }, [participation, luckyNftSwapContract]);

  useEffect(() => {
    const getFinalSwapInfo = async () => {
      if (!isSwapInProgress && luckyNftSwapContract) {
        try {
          const [address, tokenId] =
            await luckyNftSwapContract.getDepositAfterShift(userAddress);
          setFinalSwapInfo(address);
        } catch (error: any) {
          console.log(error.message);
        }
      }
    };
    getFinalSwapInfo();
  }, [isSwapInProgress, luckyNftSwapContract]);

  return (
    <>
      <h2>Your swaps</h2>
      {!isSwapInProgress && (
        <p>There are currently no swaps in progress! Come back soon :)</p>
      )}
      {participation && (
        <>
          <p>Here's the latest NFT you added to the pool:</p>
          <strong>{participationInfo}</strong>
        </>
      )}
      {participation && finalSwapInfo && (
        <>
          <p>And here's your latest lucky swap!</p>
          <strong>{finalSwapInfo}</strong>
        </>
      )}
    </>
  );
};

export default SwapStatus;
