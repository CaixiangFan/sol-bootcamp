import { ethers } from "ethers";
import "dotenv/config";
import * as tokenJson from "../artifacts/contracts/ERC20.sol/EncodeBootcampMayToken.json";
import { exit } from "process";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

function setupProvider() {
  const infuraOptions = process.env.INFURA_API_KEY
    ? process.env.INFURA_API_SECRET
      ? {
          projectId: process.env.INFURA_API_KEY,
          projectSecret: process.env.INFURA_API_SECRET,
        }
      : process.env.INFURA_API_KEY
    : "";
  const options = {
    alchemy: process.env.ALCHEMY_API_KEY,
    infura: infuraOptions,
  };
  const provider = ethers.providers.getDefaultProvider("ropsten", options);
  return provider;
}

async function attach() {
  const wallet =
    process.env.MNEMONIC && process.env.MNEMONIC.length > 0
      ? ethers.Wallet.fromMnemonic(process.env.MNEMONIC)
      : new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  console.log(`Using address ${wallet.address}`);
  const provider = setupProvider();
  const signer = wallet.connect(provider);
  const balanceBN = await signer.getBalance();
  const balance = Number(ethers.utils.formatEther(balanceBN));
  console.log(`Wallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }
  console.log("attaching token contract");
  let tokenAddress = "";
  if (process.env.CONTRACT_ADDRESS && process.env.CONTRACT_ADDRESS.length > 0) {
    tokenAddress = process.env.CONTRACT_ADDRESS;
  }else{
    console.log("PLease deploy smart contract first and fill the deployed address into the .env file.")
    exit();
  }
  const tokenContract = new ethers.Contract(
    tokenAddress,
    tokenJson.abi,
    signer
  );
  console.log("Completed");
  console.log(`Contract attached at ${tokenContract.address}`);
  return { tokenContract, provider, signer };
}

async function main() {
  const { tokenContract, provider, signer } = await attach();
  const deployerAddress = process.env.DEPLOYER_ADDRESS;
  const balance = await tokenContract.balanceOf(deployerAddress);
  console.log(`Balance of ${deployerAddress} is ${balance}`);

  // console.log("Trying to steal tokens.");
  // const tx = await tokenContract.transfer(signer.address, 50);
  // console.log(`New balance of ${deployerAddress} is ${await tokenContract.balanceOf(deployerAddress)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Deployed contract in the recording: 0x1Af1CD6d6da31b1a8add5b5F48120410ddEAE4be
// Token Tracker: https://ropsten.etherscan.io/token/0x1Af1CD6d6da31b1a8add5b5F48120410ddEAE4be