import { useEffect, useState } from 'react';

enum LoadingStatus {
  LOADING = 'Loading NFTs.',
  SUCCESS = '',
  NO_RESULTS = 'No NFTs in the pool right now. Be the first to deposit!',
  FAILED = 'Oops, fetching NFTs failed.'
}

interface Deposit {
  nftContractAdcress: string;
  tokenId: number;
}

const NftPool = ({ luckyNftSwapContract }: any) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [poolCap, setPoolCap] = useState<number>(0);
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.LOADING
  );

  useEffect(() => {
    if (!luckyNftSwapContract) return;
    const getDeposits = async () => {
      try {
        setLoadingStatus(LoadingStatus.LOADING);
        const deposits = await luckyNftSwapContract.getDeposits();
        if (deposits && deposits.length > 0) {
          setDeposits(deposits);
          setLoadingStatus(LoadingStatus.SUCCESS);
        } else setLoadingStatus(LoadingStatus.NO_RESULTS);
        return;
      } catch (e) {
        console.log(e);
        setLoadingStatus(LoadingStatus.FAILED);
      }
    };
    const getPoolCap = async () => {
      try {
        setLoadingStatus(LoadingStatus.LOADING);
        const poolCap = await luckyNftSwapContract.poolCap();
        setPoolCap(Number(poolCap));
      } catch (e) {
        console.log(e);
        setLoadingStatus(LoadingStatus.FAILED);
      }
    };
    getDeposits();
    getPoolCap();
  }, [luckyNftSwapContract]);

  return (
    <>
      <h2>Current NFTs in the lucky swap</h2>
      {loadingStatus !== LoadingStatus.SUCCESS ? (
        <p>{loadingStatus}</p>
      ) : (
        <p>
          There are currently {deposits.length} NFTs in the swap out of{' '}
          {poolCap}
        </p>
      )}
    </>
  );
};

export default NftPool;
