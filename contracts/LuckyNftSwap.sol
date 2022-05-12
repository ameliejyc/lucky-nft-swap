// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

//import "@openzeppelin/contracts@4.5.0/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
//remove and

import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


// abstract contract luckyNftSwap is IERC721Receiver {
contract LuckyNftSwap is IERC721Receiver {

    struct Deposit {
        address nftContractAdcress;
        uint256 tokenId;
    }

    // mapping depositor address to deposit details
    Deposit[] public deposits;
    mapping(address => uint) public depositorCounterMap;

    uint256 public counter = 0;
    uint shiftNumber;
    uint poolCap;
    bool luckySwapEnded = false;

    //events declaration



    event TokenDeposit(address, address _addColection, uint256 tokenId);
    event Shifted(uint _move);
    event TokenSend(address recipient, address _addColection, uint256 tokenId);


    constructor(uint _poolCap)  {
        poolCap = _poolCap;
    }

    // function to deposit token
    function deposit(address _addColection, uint256 _tokenId) public {
        require(counter < poolCap, 'Pool is full');

        IERC721 nft = IERC721(_addColection);

        // address addColection = _addColection;

        deposits.push(Deposit(_addColection, _tokenId));
        depositorCounterMap[msg.sender] = counter;
        counter++;
        nft.safeTransferFrom(msg.sender, address(this), _tokenId, "0x00");

        emit TokenDeposit(msg.sender, _addColection, _tokenId);
    }

    // function require to "chandle" erc721 ( checked by safeTransfer )

    function onERC721Received(
    // function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) override external returns (bytes4){
        return bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));
    }


    // withdraw function



    function withdraw(address depositor) public {
        require(luckySwapEnded, 'Lucky swap in proogress');
        Deposit memory depositToReceive = getDepositAfterShift(depositor);

        address nftContractAdcress = depositToReceive.nftContractAdcress;
        IERC721 nft = IERC721(nftContractAdcress);
        uint tokenId = depositToReceive.tokenId;
        // _nftAddress.safeTransferFrom(address(this), msg.sender, deposit[msg.sender].tokenId,"0x00");
        nft.safeTransferFrom(address(this), depositor, tokenId, "0x00");
        // delete deposits[msg.sender];
        emit TokenSend(depositor, nftContractAdcress, tokenId);
    }

    function getDepositAfterShift(address depositor) public view returns (Deposit memory)  {
        uint depositedCounter = depositorCounterMap[depositor];
        uint depositIndexAfterShift = (depositedCounter + shiftNumber) % poolCap;
        return deposits[depositIndexAfterShift];
    }


    function shift(uint256 _move) public {
        require(counter == poolCap, 'Need to deposit more nfts');
        require(!luckySwapEnded, 'Lucky swap already ended');
        shiftNumber = uint256(block.number - 1);
    }

    function getDeposits() public view returns (Deposit[] memory) {
        return deposits;
    }

}