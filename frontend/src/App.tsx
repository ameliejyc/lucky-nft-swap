import { ReactElement, useEffect, useState } from 'react';
import { ethers, Signer } from 'ethers';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { Provider } from './utils/provider';
import LuckyNftSwapArtifact from './artifacts/contracts/LuckyNftSwap.sol/LuckyNftSwap.json';
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
  const { library } = useWeb3React<Provider>();
  const [contract, setContract] = useState<ethers.Contract>();
  const [signer, setSigner] = useState<Signer>();
  const [participation, setParticipation] = useState();
  const [isSwapInProgress, setIsSwapInProgress] = useState<boolean>(true);

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }
    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (!signer) return;
    const getContract = async () => {
      const luckyNftSwapContract = new ethers.Contract(
        '0x8464135c8F25Da09e49BC8782676a84730C318bC', // TODO pass env variable in for deployment address
        LuckyNftSwapArtifact.abi,
        signer
      );
      setContract(luckyNftSwapContract);
    };

    getContract();
  }, [signer]);

  // Only using this during development to deploy contract locally
  function handleDeployContract(event: any) {
    event.preventDefault();

    // only deploy the Greeter contract one time, when a signer is defined
    if (contract || !signer) {
      return;
    }

    async function deployLuckyNftSwapContract(signer: Signer): Promise<void> {
      const LuckyNftSwap = new ethers.ContractFactory(
        LuckyNftSwapArtifact.abi,
        LuckyNftSwapArtifact.bytecode,
        signer
      );

      try {
        const luckyNftSwapContract = await LuckyNftSwap.deploy(4);
        await luckyNftSwapContract.deployed();
        const deposits = await luckyNftSwapContract.getDeposits();
        console.log({ deposits });
        setContract(luckyNftSwapContract);

        window.alert(
          `LuckyNftSwap deployed to: ${luckyNftSwapContract.address}`
        );
      } catch (error: any) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployLuckyNftSwapContract(signer);
  }

  // WIP: status method on contract is not yet implemented
  const refreshStatus = async () => {
    if (!contract) return;
    try {
      const status = await contract.getStatus();
      // setIsSwapInProgress(); set swap status
      // setParticipation(); set participant data if available
    } catch (e) {
      console.log(e);
    }
  };

  // WIP
  useEffect(() => {
    if (!contract) return;
    // refreshStatus();
  }, [contract]);

  return (
    <StyledAppDiv>
      <ActivateDeactivate />
      <button onClick={handleDeployContract}>test deploy</button>
      <StyledAppHeader>Lucky NFT Swap</StyledAppHeader>
      <StyledAppSubHeader>
        Want to shake up your NFT collection? Deposit an NFT into the lucky
        swap. Get a random one back.
      </StyledAppSubHeader>
      {isSwapInProgress && participation ? (
        <>
          <NftPool luckyNftSwapContract={contract} />
          <SwapStatus isSwapInProgress={true} participation={participation} />
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
        <SwapStatus isSwapInProgress={false} participation={participation} />
      )}
    </StyledAppDiv>
  );
}
