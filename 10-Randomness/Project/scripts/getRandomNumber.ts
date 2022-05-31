import { ethers } from "hardhat";
import * as readline from "readline";
import { NotQuiteRandom, PseudoRandom } from "../typechain";

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question(
    "Select operation: \n Options: \n [0]: Random from Math.random \n [1]: Random from block hash \n [2]: Toss a coin \n [3]: Message signature \n [4]: Random from a sealed seed \n [5]: Random from block hash plus a sealed seed \n",
    (answer) => {
      console.log(`Selected: ${answer}`);
      const option = Number(answer);
      switch (option) {
        case 0:
          mathRandomness();
          break;
        case 1:
          blockHashRandomness();
          break;
        case 2:
          tossCoin();
          break;
        case 3:
          signature();
          break;
        case 4:
          sealedSeed();
          break;
        case 5:
          randomSealedSeed();
          break;
        default:
          console.log("Invalid");
          break;
      }
      rl.close();
    }
  );
}

function mathRandomness() {
  console.log(Math.random());
}

function blockHashRandomness() {
  ethers.getContractFactory("NotQuiteRandom").then((contractFactory) => {
    contractFactory.deploy().then((deployedContractObject) => {
      const deployedContract = deployedContractObject as NotQuiteRandom;
      deployedContract.generateRandomNumber().then((randomNumberBN) => {
        console.log(
          `The random number generated was ${randomNumberBN.toString()}`
        );
      });
    });
  });
}

async function tossCoin() {
  const contractFactory = await ethers.getContractFactory("NotQuiteRandom");
  contractFactory.deploy().then(async (result) => {
    result.deployed().then(async (contractObj) => {
      const contract = contractObj as NotQuiteRandom;
      const currentBlock = await ethers.provider.getBlock("latest");
      const number = await contract.generateRandomNumber();
      const heads = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock.number}\nBlock hash: ${
          currentBlock.hash
        }\nThe random number is ${number} \nThe coin landed as: ${
          heads ? "Heads" : "Tails"
        }`
      );
      await ethers.provider.send("evm_mine", [currentBlock.timestamp + 1]);
      const currentBlock2 = await ethers.provider.getBlock("latest");
      const number2 = await contract.generateRandomNumber();
      const heads2 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock2.number}\nBlock hash: ${
          currentBlock2.hash
        }\nThe random number is ${number2} \nThe coin landed as: ${
          heads2 ? "Heads" : "Tails"
        }`
      );
      await ethers.provider.send("evm_mine", [currentBlock2.timestamp + 1]);
      const currentBlock3 = await ethers.provider.getBlock("latest");
      const number3 = await contract.generateRandomNumber();
      const heads3 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock3.number}\nBlock hash: ${
          currentBlock3.hash
        }\nThe random number is ${number3} \nThe coin landed as: ${
          heads3 ? "Heads" : "Tails"
        }`
      );
      await ethers.provider.send("evm_mine", [currentBlock3.timestamp + 1]);
      const currentBlock4 = await ethers.provider.getBlock("latest");
      const number4 = await contract.generateRandomNumber();
      const heads4 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock4.number}\nBlock hash: ${
          currentBlock4.hash
        }\nThe random number is ${number4} \nThe coin landed as: ${
          heads4 ? "Heads" : "Tails"
        }`
      );
      await ethers.provider.send("evm_mine", [currentBlock4.timestamp + 1]);
      const currentBlock5 = await ethers.provider.getBlock("latest");
      const number5 = await contract.generateRandomNumber();
      const heads5 = await contract.tossCoin();
      console.log(
        `Block number: ${currentBlock5.number}\nBlock hash: ${
          currentBlock5.hash
        }\nThe random number is ${number5} \nThe coin landed as: ${
          heads5 ? "Heads" : "Tails"
        }`
      );
    });
  });
}

async function signature() {
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a message to be signed:\n", async (answer) => {
    const signedMessage = await signer.signMessage(answer);
    console.log(`The signed message is:\n${signedMessage}`);
    rl.close();
    testSignature();
  });
}

async function testSignature() {
  console.log("Verifying signature\n");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter message signature:\n", (signature) => {
    rl.question("Enter message:\n", (message) => {
      const address = ethers.utils.verifyMessage(message, signature);
      console.log(`This message signature matches with address ${address}`);
      rl.question("Repeat? [Y/N]:\n", (answer) => {
        rl.close();
        if (answer.toLowerCase() === "y") {
          testSignature();
        }
      });
    });
  });
}

async function sealedSeed() {
  console.log("Deploying contract");
  const contractFactory = await ethers.getContractFactory("PseudoRandom");
  const contractObj = await contractFactory.deploy();
  const contract = contractObj as PseudoRandom;
  await contract.deployed();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a random seed to be signed:\n", async (seed) => {
    const signedMessage = await signer.signMessage(seed);
    rl.close();
    console.log(`The signed message is:\n${signedMessage}`);
    const sig = ethers.utils.splitSignature(signedMessage);
    console.log("Saving signature at contract");
    await contract.setSignature(sig.v, sig.r, sig.s);
    try {
      console.log("Trying to get a number with the original seed");
      const randomNumber = await contract.getRandomNumber(seed);
      console.log(`Random number result:\n${randomNumber}`);
      console.log("Trying to get a number without the original seed");
      const fakeSeed = "FAKE_SEED";
      const randomNumber2 = await contract.getRandomNumber(fakeSeed);
      console.log(`Random number result:\n${randomNumber2}`);
    } catch (error) {
      console.log("Operation failed");
    }
  });
}

async function randomSealedSeed() {
  console.log("Deploying contract");
  const contractFactory = await ethers.getContractFactory("PseudoRandom");
  const contractObj = await contractFactory.deploy();
  const contract = contractObj as PseudoRandom;
  await contract.deployed();
  const signers = await ethers.getSigners();
  const signer = signers[0];
  console.log(
    `Signing a message with the account of address ${signer.address}`
  );
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter a random seed to be signed:\n", async (seed) => {
    const signedMessage = await signer.signMessage(seed);
    rl.close();
    console.log(`The signed message is:\n${signedMessage}`);
    const sig = ethers.utils.splitSignature(signedMessage);
    console.log("Saving signature at contract");
    await contract.setSignature(sig.v, sig.r, sig.s);
    try {
      console.log("Trying to get a number with the original seed");
      const randomNumber = await contract.getCombinedRandomNumber(seed);
      console.log(`Random number result:\n${randomNumber}`);
      console.log("Trying to get a number without the original seed");
      const fakeSeed = "FAKE_SEED";
      const randomNumber2 = await contract.getCombinedRandomNumber(fakeSeed);
      console.log(`Random number result:\n${randomNumber2}`);
    } catch (error) {
      console.log("Operation failed");
    }
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
