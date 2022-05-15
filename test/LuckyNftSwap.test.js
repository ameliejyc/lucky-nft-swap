const {expect} = require('chai');
const {ethers} = require('hardhat');
const {BigNumber} = require("ethers");

describe('LuckyNftSwap', () => {
    let luckyNftSwapDeployed;
    let exampleNftDeployed;
    let exampleNFT;
    let luckyNftSwap;

    before(async () => {
        const LuckyNftSwap = await ethers.getContractFactory('LuckyNftSwap');
        luckyNftSwap = await LuckyNftSwap.deploy([2]);
        const ExampleNFT = await ethers.getContractFactory('ExampleNFT');
        exampleNFT = await ExampleNFT.deploy();
        luckyNftSwapDeployed = await luckyNftSwap.deployed();
        exampleNftDeployed = await exampleNFT.deployed();
    })

    it('Should test deposit 1 nft', async () => {
        const [owner, address1, address2] = await ethers.getSigners();
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

    it('Should test deposit until full cap', async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        const mintTx2 = await exampleNFT.safeMint(address2.address);
        await mintTx2.wait();
        const approveTx2 = await exampleNFT.connect(address2).approve(luckyNftSwapDeployed.address, 1);
        await approveTx2.wait();

        const depositTx2 = await luckyNftSwap.connect(address2).deposit(exampleNftDeployed.address, 1);
        await depositTx2.wait();

        const deposits = await luckyNftSwap.getDeposits()
        console.log(deposits)
        expect(deposits.length).to.be.equal(2);
        expect(deposits[0][0]).to.be.equal(exampleNftDeployed.address);
        expect(deposits[0][1]).to.be.equal(BigNumber.from(0));
        expect(deposits[1][0]).to.be.equal(exampleNftDeployed.address);
        expect(deposits[1][1]).to.be.equal(BigNumber.from(1));
        const counter2 = await luckyNftSwap.depositorCounterMap(address2.address);
        console.log(counter2);
        expect(counter2).to.be.equal(BigNumber.from(2));

    });

    it('Should test shift', async () => {
        const shiftTx = await luckyNftSwap.shift();
        await shiftTx.wait();

        const shiftNumber = await luckyNftSwap.shiftNumber()
        console.log(shiftNumber)
        expect(shiftNumber).to.be.gt(0);
    });

    it('Should test withdraw', async () => {
        const [owner, address1, address2] = await ethers.getSigners();
        console.log(address1.address)
        console.log(address2.address)
        const withdrawTx1 = await luckyNftSwap.withdraw(address1.address);
        await withdrawTx1.wait()
        const withdrawTx2 = await luckyNftSwap.withdraw(address2.address);
        await withdrawTx2.wait()

        const owner1 = await exampleNFT.ownerOf(0)
        const owner2 = await exampleNFT.ownerOf(1)

        console.log(owner1)
        console.log(owner2)
        expect(owner1).to.be.oneOf([address1.address, address2.address]);
        expect(owner2).to.be.oneOf([address1.address, address2.address]);
    });
});