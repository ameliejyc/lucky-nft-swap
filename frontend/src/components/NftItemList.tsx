import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { Provider } from '../utils/provider';
import { useMoralisWeb3Api, useMoralis } from 'react-moralis';
import { useVerifyMetadata } from '../hooks/useVerifyMetadata';
import { getNetwork } from '../utils/helpers';
import NftItem, { NFT } from './NftItem';

enum LoadingStatus {
  LOADING = 'Loading your NFTs.',
  SUCCESS = '',
  NO_RESULTS = 'No NFTs found on this account.',
  FAILED = 'Sorry, fetching your NFTs failed. Please try again.',
  UNAUTHORISED = 'Connect to your wallet to fetch your NFTs and play Lucky NFT Swap!'
}

const StyledNFTGrid = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 100%;
`;

const NftItemList = ({ signer, luckyNftSwapContract, refreshStatus }: any) => {
  const Web3Api = useMoralisWeb3Api();
  const { account, chainId } = useWeb3React<Provider>();
  const { isInitialized } = useMoralis();
  const [loadingStatus, setLoadingStatus] = useState<LoadingStatus>(
    LoadingStatus.SUCCESS
  );
  const [onChainNFTs, setOnChainNFTs] = useState<any>([]);
  const { verifyMetadata } = useVerifyMetadata();

  useEffect(() => {
    if (isInitialized) {
      const getNFTs = async () => {
        if (account) {
          try {
            setLoadingStatus(LoadingStatus.LOADING);
            const NFTs = await Web3Api.account.getNFTs({
              chain: getNetwork(chainId), // e.g. 'rinkeby'
              address: account // e.g. '0x0c4F6baFB40663BeC5a24cAb510C4764E4C4d86C'
            });
            if (NFTs.result && NFTs.result.length > 0) {
              setOnChainNFTs(NFTs.result);
              setLoadingStatus(LoadingStatus.SUCCESS);
            } else setLoadingStatus(LoadingStatus.NO_RESULTS);
          } catch (e) {
            console.error(e);
            setLoadingStatus(LoadingStatus.FAILED);
          }
        } else setLoadingStatus(LoadingStatus.UNAUTHORISED);
      };
      getNFTs();
    }
  }, [isInitialized, account]);

  return (
    <>
      <h2>Your NFTs to deposit</h2>
      {loadingStatus !== LoadingStatus.SUCCESS ? (
        <p>{loadingStatus}</p>
      ) : (
        <StyledNFTGrid>
          {onChainNFTs &&
            onChainNFTs.map((nft: NFT, index: number) => {
              nft = verifyMetadata(nft);
              return (
                <NftItem
                  key={index}
                  nft={nft}
                  chainId={chainId}
                  signer={signer}
                  luckyNftSwapContract={luckyNftSwapContract}
                  refreshStatus={refreshStatus}
                />
              );
            })}
        </StyledNFTGrid>
      )}
    </>
  );
};

export default NftItemList;
