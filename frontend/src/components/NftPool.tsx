import { useEffect, useState } from 'react';
import styled from 'styled-components';

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

const StyledNFTGrid = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
`;

const NftPool = ({ luckyNftSwapContract }: any) => {
  const [deposits, setDeposits] = useState<Deposit[]>([]);
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
          setDeposits(deposits.result);
          setLoadingStatus(LoadingStatus.SUCCESS);
        } else setLoadingStatus(LoadingStatus.NO_RESULTS);
        console.log('getDeposits call returned', deposits);
        return;
      } catch (e) {
        console.log(e);
        setLoadingStatus(LoadingStatus.FAILED);
      }
    };
    getDeposits();
  }, [luckyNftSwapContract]);

  return (
    <>
      <h2>Current NFTs in the lucky swap</h2>
      {loadingStatus !== LoadingStatus.SUCCESS ? (
        <p>{loadingStatus}</p>
      ) : (
        <StyledNFTGrid>
          {deposits.map((deposit, index) => (
            <p key={index}>{deposit.nftContractAdcress}</p>
          ))}
        </StyledNFTGrid>
      )}
    </>
  );
};

export default NftPool;
