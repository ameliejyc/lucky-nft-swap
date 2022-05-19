import { useState } from 'react';
import { ContractInterface, ethers } from 'ethers';
import styled from 'styled-components';
import imageFallback from '../imageFallback.svg';
import { getExplorer } from '../utils/helpers';
export interface NFT {
  token_address: string;
  token_id: string;
  contract_type: string;
  owner_of: string;
  block_number: string;
  block_number_minted: string;
  token_uri?: string | undefined;
  metadata?: string | undefined;
  synced_at?: string | undefined;
  amount?: string | undefined;
  image?: string;
  name: string;
  symbol: string;
}

enum TransferStatus {
  NOT_APPROVED = 'Approve this NFT',
  IN_PROGRESS = 'In progress...',
  APPROVED = 'Approved! Now deposit this NFT',
  SUCCESS = 'Deposit successful!',
  UNVERIFIED_CONTRACT = "Sorry, this NFT's contract is unverified. You can only approve NFTs for transfer that have verified contracts.",
  FAILED = 'Oops, sorry something went wrong.'
}

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: space-between;
  min-width: 200px;
  max-width: 250px;
  height: auto;
  margin-bottom: 1rem;
  padding: 0.5rem;
`;

const StyledButton = styled.button`
  width: auto;
  height: 2.5rem;
  padding: 0 1rem;
  margin: 0.5rem;
  border-color: black;
  background-color: white;
`;

const StyledImage = styled.img`
  height: 150px;
  margin-bottom: 0.5rem;
`;

const NftItem = ({ nft, chainId, signer }: any) => {
  const [transferStatus, setTransferStatus] = useState<TransferStatus>(
    TransferStatus.NOT_APPROVED
  );

  const getABI = async () => {
    try {
      const abi = ['function approve(address, uint256) external'];
      return abi;
    } catch (e: any) {
      console.log(e.message);
    }
  };

  const getTransferAction = () => {
    if (transferStatus === TransferStatus.NOT_APPROVED) return getApproval();
    if (transferStatus === TransferStatus.APPROVED) return deposit();
  };

  const getApproval = async () => {
    try {
      setTransferStatus(TransferStatus.IN_PROGRESS);
      const abi = await getABI();
      const nftContract = new ethers.Contract(
        nft.token_address,
        abi as ContractInterface,
        signer
      );
      console.log({ nftContract });
      const approvalTransaction = await nftContract.approve(
        '', // luckyNftSwapContract
        nft.token_id
      );
      await approvalTransaction.wait();
      setTransferStatus(TransferStatus.APPROVED);
    } catch (e: any) {
      if (e.message === 'Unverified contract') {
        setTransferStatus(TransferStatus.UNVERIFIED_CONTRACT);
      } else {
        setTransferStatus(TransferStatus.FAILED);
        console.log(e.message);
      }
    }
  };

  const deposit = async () => {
    try {
      // const depositNftTransaction = await luckyNftSwapContract.deposit(
      //   nft.token_address,
      //   nft.token_id
      // );
      // await depositNftTransaction.wait();
      return console.log('deposit called');
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <StyledCard>
      <a
        href={`${getExplorer(chainId)}address/${nft.token_address}`}
        target="_blank"
        rel="noreferrer"
      >
        <StyledImage
          src={nft.image || nft.metadata?.image || imageFallback}
          alt={`Image of nft from ${nft.name}`}
        />
      </a>
      <strong>{nft.name}</strong>
      {transferStatus !== TransferStatus.NOT_APPROVED &&
      transferStatus !== TransferStatus.APPROVED ? (
        <p>{transferStatus}</p>
      ) : (
        <StyledButton onClick={getTransferAction}>
          {transferStatus}
        </StyledButton>
      )}
    </StyledCard>
  );
};

export default NftItem;
