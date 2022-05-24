import { useEffect, useState } from 'react';
import styled from 'styled-components';

enum LoadingStatus {
  LOADING = 'Loading NFTs...',
  SUCCESS = '',
  NO_RESULTS = 'No NFTs in the pool right now. Be the first to deposit!',
  FAILED = 'Oops, fetching NFTs failed.'
}

interface Deposit {
  nftContractAdcress: string;
  tokenId: number;
}

const StyledCardContainer = styled.div`
  display: flex;
  width: 400px;
  justify-content: space-around;
  margin-bottom: 1rem;
`;

const StyledCard = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  background-color: lightgreen;
  font-size: 3rem;
`;

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
      <h2>Pool status</h2>
      {loadingStatus !== LoadingStatus.SUCCESS ? (
        <p>{loadingStatus}</p>
      ) : (
        <>
          <StyledCardContainer>
            <StyledCard>?</StyledCard>
            <StyledCard>?</StyledCard>
            <StyledCard>?</StyledCard>
          </StyledCardContainer>
          <p>
            There are currently <strong>{deposits.length}</strong> NFTs in the
            swap out of a maximum of <strong>{poolCap}</strong>.
          </p>
        </>
      )}
    </>
  );
};

export default NftPool;
