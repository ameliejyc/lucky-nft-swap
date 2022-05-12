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
    mapping(uint256 => Deposit)  public deposits;
    address[] public DepositorsArrary;
    address[] public tempDepositorsArrary;

    uint256 public counter;

    //events declaration



    event TokenDeposit(address, address _addColection, uint256 tokenId);
    event Shifted(uint _move);
    event TokenSend(address recipient, address _addColection, uint256 tokenId);


    constructor()  {}


    //source of sudo randomnes
    function getrandom() public view returns (uint256 hash){

        //hash = uint256( blockhash(block.number -1 ));    // hash unavaible on remix
        hash = uint256(block.number - 1);

    }


    // function to deposit token
    function deposit(address _addColection, uint256 _tokenId) public {
        IERC721 nft = IERC721(_addColection);

        // address addColection = _addColection;

        deposits[counter] = Deposit(_addColection, _tokenId);
        DepositorsArrary.push(msg.sender);
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



    function withdraw(uint256 _tokenIdinArrary) public {
        address nftContractAdcress = deposits[_tokenIdinArrary].nftContractAdcress;
        IERC721 nft = IERC721(nftContractAdcress);
        address recipient = DepositorsArrary[_tokenIdinArrary];
        uint tokenId = deposits[_tokenIdinArrary].tokenId;
        // _nftAddress.safeTransferFrom(address(this), msg.sender, deposit[msg.sender].tokenId,"0x00");
        nft.safeTransferFrom(address(this), recipient, tokenId, "0x00");
        // delete deposits[msg.sender];
        emit TokenSend(recipient, nftContractAdcress, tokenId);
    }


    function shift(uint256 _move) public {
        uint256 size = DepositorsArrary.length;
        //address[] storage tempDepositorsArrary;
        // uint256 mod = ( 0 + _move) % size;
        for (uint i = 0; i < size; ++i) {
            //keyListShifted[i] = keyList[(i+_move)%  size];
            // keyListShifted.push(keyList[i]);
            tempDepositorsArrary.push(DepositorsArrary[(i + _move) % size]);
        }
        DepositorsArrary = tempDepositorsArrary;
        emit Shifted(_move);
    }

}