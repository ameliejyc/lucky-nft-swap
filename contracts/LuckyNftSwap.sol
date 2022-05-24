//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

//TODO: prepare deployment script
contract LuckyNftSwap is IERC721Receiver, Ownable {
  //contract LuckyNftSwap {
  struct Deposit {
    address nftContractAdcress;
    //TODO: try to lower 256 -> ?
    uint256 tokenId; //AR:test changing size for gas optimization
  }

  // mapping depositor address to deposit details
  Deposit[] public deposits;
  mapping(address => uint256) public depositorCounterMap; //
  address[] public depositorArr; //to change

  uint256 public counter = 1; //AR: it was working with 1 ? should be 0
  uint256 public shiftNumber;
  uint256 public poolCap;
  bool luckySwapEnded = false;

  //events declaration

  event TokenDeposit(address, address _addColection, uint256 tokenId);
  event Shifted(uint256 _move);
  event TokenSend(address recipient, address _addColection, uint256 tokenId);

  constructor(uint256 _poolCap) {
    poolCap = _poolCap;
  }

  //TODO: add game id to handle multiple lotteries in the same time
  // function to deposit token
  function deposit(address _addColection, uint256 _tokenId) public {
    require(counter <= poolCap, 'Pool is full');
    require(
      depositorCounterMap[msg.sender] == 0,
      'Deposit from this address already made'
    );

    IERC721 nft = IERC721(_addColection);

    deposits.push(Deposit(_addColection, _tokenId));
    depositorCounterMap[msg.sender] = counter; //
    depositorArr.push(msg.sender); // to change
    counter++;
    nft.safeTransferFrom(msg.sender, address(this), _tokenId, '0x00');

    emit TokenDeposit(msg.sender, _addColection, _tokenId);
    if (counter > poolCap) {
      shift();
      //withdrawAll();
    }
  }

  // function require to "chandle" erc721 ( checked by safeTransfer )

  function onERC721Received(
    // function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes calldata data
  ) external override returns (bytes4) {
    return bytes4(keccak256('onERC721Received(address,address,uint256,bytes)'));
  }

  // withdraw function

  function withdraw(address depositor) public {
    require(luckySwapEnded, 'Lucky swap in proogress');
    Deposit memory depositToReceive = getDepositAfterShift(depositor);

    address nftContractAdcress = depositToReceive.nftContractAdcress;
    IERC721 nft = IERC721(nftContractAdcress);
    uint256 tokenId = depositToReceive.tokenId;
    // _nftAddress.safeTransferFrom(address(this), msg.sender, deposit[msg.sender].tokenId,"0x00");
    nft.safeTransferFrom(address(this), depositor, tokenId, '0x00');
    // delete deposits[msg.sender];
    emit TokenSend(depositor, nftContractAdcress, tokenId);
  }

  function withdrawAll() public {
    //AR: addd only owner mofifier
    require(luckySwapEnded, 'Lucky swap in proogress');

    //uint256 arrSize = depositorCounterMap.length;
    for (uint256 i = 0; i < poolCap; ++i) {
      address depositorAddress = depositorArr[i];
      Deposit memory depositToReceive = deposits[(i + shiftNumber) % poolCap];
      IERC721 nft = IERC721(depositToReceive.nftContractAdcress);
      uint256 tokenId = depositToReceive.tokenId;
      nft.safeTransferFrom(address(this), depositorAddress, tokenId, '0x00');
      emit TokenSend(depositorAddress, depositorAddress, tokenId);
    }
  }

  function getDepositAfterShift(address depositor)
    public
    view
    returns (Deposit memory)
  {
    uint256 depositedCounter = depositorCounterMap[depositor];
    require(depositedCounter != 0, 'No deposit for address found');

    uint256 depositIndexAfterShift = (depositedCounter + shiftNumber) % poolCap;
    return deposits[depositIndexAfterShift];
  }

  function shift() public {
    require(counter >= poolCap, 'Need to deposit more nfts');
    require(!luckySwapEnded, 'Lucky swap already ended');
    luckySwapEnded = true;
    //TODO: replace by chainlink
    shiftNumber = uint256(block.number - 1);
    withdrawAll();
    emit Shifted(shiftNumber);
  }

  function getDeposits() public view returns (Deposit[] memory) {
    return deposits;
  }

  function setPoolCap(uint256 _newCap) public onlyOwner {
    require(_newCap >= counter, 'New cap must be > counter');
    poolCap = _newCap;
  }

  function isGameEndedIsAddressDepositor(address participant)
    public
    view
    returns (bool, bool)
  {
    return (luckySwapEnded, depositorCounterMap[participant] != 0);
  }

  function getOriginalDeposit(address depositor)
    public
    view
    returns (Deposit memory)
  {
    uint256 depositedCounter = depositorCounterMap[depositor];
    require(depositedCounter != 0, 'No deposit for address found');

    return deposits[depositedCounter - 1];
  }
}
