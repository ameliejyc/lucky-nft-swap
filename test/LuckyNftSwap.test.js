const { expect } = require('chai');
const { ethers } = require('hardhat');
const { BigNumber } = require("ethers");

describe('LuckyNftSwap', () => {
    let luckyNftSwapDeployed;
    let luckyNftSwap;

    let exampleNftDeployed;
    let exampleNFT;

    let AnotherexampleNftDeployed;
    let AnotherexampleNFT;

    let owner, address1, address2, address3, address4;

    before(async () => {
        const LuckyNftSwap = await ethers.getContractFactory('LuckyNftSwap');
        luckyNftSwap = await LuckyNftSwap.deploy([3]);
        luckyNftSwapDeployed = await luckyNftSwap.deployed();

        const ExampleNFT = await ethers.getContractFactory('ExampleNFT');
        exampleNFT = await ExampleNFT.deploy();
        exampleNftDeployed = await exampleNFT.deployed();

        const AnotherExampleNFT = await ethers.getContractFactory('AnotherExampleNFT');
        AnotherexampleNFT = await AnotherExampleNFT.deploy();
        AnotherexampleNftDeployed = await AnotherexampleNFT.deployed();
        [owner, address1, address2, address3, address4] = await ethers.getSigners();
    })

    it('Should test deposit 1 nft from Example NFT collection', async () => {
        const mintTx = await exampleNFT.safeMint(address1.address);
        await mintTx.wait();
        const approveTx = await exampleNFT.connect(address1).approve(luckyNftSwapDeployed.address, 0);
        await approveTx.wait();

        const depositTx = await luckyNftSwap.connect(address1).deposit(exampleNftDeployed.address, 0);
        await depositTx.wait();

        const deposits = await luckyNftSwap.getDeposits()
        console.log(deposits)
        expect(deposits.length).to.be.equal(1);
        expect(deposits[0][0]).to.be.equal(exampleNftDeployed.address);
        expect(deposits[0][1]).to.be.equal(BigNumber.from(0));
        const counter1 = await luckyNftSwap.depositorCounterMap(address1.address);
        console.log(counter1);
        expect(counter1).to.be.equal(BigNumber.from(1));
    });

    it('Should test deposit 1 nft from Another Example NFT collection', async () => {
        const mintTx = await AnotherexampleNFT.safeMint(address3.address);
        await mintTx.wait();
        const approveTx = await AnotherexampleNFT.connect(address3).approve(luckyNftSwapDeployed.address, 0);
        await approveTx.wait();

        const depositTx = await luckyNftSwap.connect(address3).deposit(AnotherexampleNftDeployed.address, 0);
        await depositTx.wait();

        const deposits = await luckyNftSwap.getDeposits()
        console.log(deposits)
        expect(deposits.length).to.be.equal(2);
        expect(deposits[1][0]).to.be.equal(AnotherexampleNftDeployed.address);
        expect(deposits[1][1]).to.be.equal(BigNumber.from(0));
        const counter1 = await luckyNftSwap.depositorCounterMap(address3.address);
        console.log(counter1);
        expect(counter1).to.be.equal(BigNumber.from(2));
    });

    it('should test isGameEndedIsAddressDepositor: test 1', async () => {
        const isGameEndedIsAddressDepositor = await luckyNftSwap.isGameEndedIsAddressDepositor(address1.address);

        console.log(isGameEndedIsAddressDepositor)
        expect(isGameEndedIsAddressDepositor[0]).to.be.equal(false)
        expect(isGameEndedIsAddressDepositor[1]).to.be.equal(true)
    });

    it('Should test deposit until full cap', async () => {
        const mintTx2 = await exampleNFT.safeMint(address2.address);
        await mintTx2.wait();
        const approveTx2 = await exampleNFT.connect(address2).approve(luckyNftSwapDeployed.address, 1);
        await approveTx2.wait();

        const depositTx2 = await luckyNftSwap.connect(address2).deposit(exampleNftDeployed.address, 1);
        await depositTx2.wait();

        const deposits = await luckyNftSwap.getDeposits()
        console.log(deposits)
        expect(deposits.length).to.be.equal(3);
        expect(deposits[0][0]).to.be.equal(exampleNftDeployed.address);
        expect(deposits[0][1]).to.be.equal(BigNumber.from(0));
        expect(deposits[1][0]).to.be.equal(AnotherexampleNftDeployed.address);
        expect(deposits[1][1]).to.be.equal(BigNumber.from(0));
        expect(deposits[2][0]).to.be.equal(exampleNftDeployed.address);
        expect(deposits[2][1]).to.be.equal(BigNumber.from(1));
        const counter2 = await luckyNftSwap.depositorCounterMap(address2.address);
        console.log(counter2);
        expect(counter2).to.be.equal(BigNumber.from(3));

    });

    it('should test isGameEndedIsAddressDepositor: test 2', async () => {
        const isGameEndedIsAddressDepositor = await luckyNftSwap.isGameEndedIsAddressDepositor(address1.address);

        console.log(isGameEndedIsAddressDepositor)
        expect(isGameEndedIsAddressDepositor[0]).to.be.equal(true)
        expect(isGameEndedIsAddressDepositor[1]).to.be.equal(true)
    });

    it('Should test shift', async () => {
        // const shiftTx = await luckyNftSwap.shift();
        // await shiftTx.wait();

        const shiftNumber = await luckyNftSwap.shiftNumber()
        console.log(shiftNumber)
        expect(shiftNumber).to.be.gt(0);
    });

    /*
        it('Should test withdraw', async () => {
            console.log(address1.address)
            console.log(address2.address)
            console.log(address3.address)
            const withdrawTx1 = await luckyNftSwap.withdraw(address1.address);
            await withdrawTx1.wait()
            const withdrawTx2 = await luckyNftSwap.withdraw(address2.address);
            await withdrawTx2.wait()
            const withdrawTx3 = await luckyNftSwap.withdraw(address3.address);
            await withdrawTx3.wait()
    
            const owner1 = await exampleNFT.ownerOf(0)
            const owner2 = await exampleNFT.ownerOf(1)
    
            console.log(owner1)
            console.log(owner2)
            expect(owner1).to.be.oneOf([address1.address, address2.address, address3.address]);
            expect(owner2).to.be.oneOf([address1.address, address2.address, address3.address]);
        });
    */
    it('Should test withdraw', async () => {
        //const [owner, address1, address2, address3] = await ethers.getSigners();
        console.log(address1.address)
        console.log(address2.address)
        console.log(address3.address)
        //const shiftTx = await luckyNftSwap.withdrawAll();
        // await shiftTx.wait();
        console.log('>>Done<<')

        const owner1 = await exampleNFT.ownerOf(0)
        const owner2 = await exampleNFT.ownerOf(1)
        const owner3 = await AnotherexampleNftDeployed.ownerOf(0)
        console.log(owner1)
        console.log(owner2)
        console.log(owner3)
        expect(owner1).to.be.oneOf([address1.address, address2.address, address3.address]);
        expect(owner2).to.be.oneOf([address1.address, address2.address, address3.address]);
        expect(owner3).to.be.oneOf([address1.address, address2.address, address3.address]);
    });


    it('Should fail when trying to get depositor after shift when there is no deposit', async () => {
        const getDepositAfterShiftPromise = luckyNftSwap.getDepositAfterShift(address4.address);

        await expect(getDepositAfterShiftPromise).to.be.revertedWith("No deposit for address found")
    });

    it('should set new pool cap', async () => {
        const setPoolCapTx = await luckyNftSwap.setPoolCap(4);
        await setPoolCapTx.wait()

        const newCap = await luckyNftSwap.poolCap();

        expect(newCap).to.be.equal(BigNumber.from(4))
    });

    it('should test get original deposit', async () => {
        const originalDepositAddress1 = await luckyNftSwap.getOriginalDeposit(address1.address);
        const originalDepositAddress2 = await luckyNftSwap.getOriginalDeposit(address2.address);
        const originalDepositAddress3 = await luckyNftSwap.getOriginalDeposit(address3.address);

        console.log(originalDepositAddress1)

        expect(originalDepositAddress1.nftContractAdcress).to.be.equal(exampleNftDeployed.address)
        expect(originalDepositAddress1.tokenId).to.be.equal(BigNumber.from(0))

        expect(originalDepositAddress2.nftContractAdcress).to.be.equal(exampleNftDeployed.address)
        expect(originalDepositAddress2.tokenId).to.be.equal(BigNumber.from(1))

        expect(originalDepositAddress3.nftContractAdcress).to.be.equal(AnotherexampleNftDeployed.address)
        expect(originalDepositAddress3.tokenId).to.be.equal(BigNumber.from(0))
    });

    //TODO: more corner case tests
});
