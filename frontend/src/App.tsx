import { ReactElement, useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { Provider } from './utils/provider';
import LuckyNftSwapArtifact from './LuckyNftSwap.json';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import NftPool from './components/NftPool';
import NftItemList from './components/NftItemList';
import SwapStatus from './components/SwapStatus';

const StyledAppDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 90vw;
  margin: auto;
`;

const StyledAppHeader = styled.h1`
  font-size: 3rem;
`;

const StyledAppSubHeader = styled.p`
  font-size: 2rem;
  margin-top: 0;
  max-width: 70%;
  text-align: center;
`;

export function App(): ReactElement {
  const { library } = useWeb3React<Provider>(undefined);
  const [contract, setContract] = useState<ethers.Contract>();
  const [signer, setSigner] = useState<Signer>();
  const [userAddress, setUserAddress] = useState<string>('');
  const [participation, setParticipation] = useState();
  const [isSwapInProgress, setIsSwapInProgress] = useState<boolean>();

  useEffect(() => {
    if (!library) return;
    const getSignerAndAddress = async () => {
      const signer = library.getSigner();
      setSigner(signer);
      const userAddress = await signer.getAddress();
      setUserAddress(userAddress);
    };
    getSignerAndAddress();
  }, [library]);

  useEffect(() => {
    if (!signer) return;
    const getContract = async () => {
      const luckyNftSwapContract = new ethers.Contract(
        '0x53AdEf53eC756e120A55d54eB581cc20CFc2ABB2',
        LuckyNftSwapArtifact.abi,
        signer
      );
      setContract(luckyNftSwapContract);
    };

    getContract();
  }, [signer]);

  const refreshStatus = async () => {
    if (!contract) return;
    try {
      const [isSwapEnded, hasUserParticipated] =
        await contract.isGameEndedIsAddressDepositor(userAddress);
      setIsSwapInProgress(!isSwapEnded);
      setParticipation(hasUserParticipated);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (!contract) return;
    refreshStatus();
  }, [contract, userAddress]);

  return (
    <StyledAppDiv>
      <ActivateDeactivate />
      <StyledAppHeader>Lucky NFT Swap</StyledAppHeader>
      <StyledAppSubHeader>
        Want to shake up your NFT collection? Deposit an NFT into the lucky
        swap. Get a random one back.
      </StyledAppSubHeader>
      {isSwapInProgress && participation ? (
        <>
          <NftPool luckyNftSwapContract={contract} />
          <SwapStatus
            isSwapInProgress={isSwapInProgress}
            participation={participation}
            userAddress={userAddress}
            luckyNftSwapContract={contract}
          />
        </>
      ) : isSwapInProgress ? (
        <>
          <NftPool luckyNftSwapContract={contract} />
          <NftItemList
            signer={signer}
            luckyNftSwapContract={contract}
            refreshStatus={refreshStatus}
          />
        </>
      ) : (
        <SwapStatus
          isSwapInProgress={isSwapInProgress}
          participation={participation}
        />
      )}
    </StyledAppDiv>
  );
}
