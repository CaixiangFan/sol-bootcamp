import { ethers } from "ethers";
import "dotenv/config";
import * as ballotJson from "../../artifacts/contracts/Ballot.sol/Ballot.json";
import { exit } from "process";

// This key is already public on Herong's Tutorial Examples - v1.03, by Dr. Herong Yang
// Do never expose your keys like this
const EXPOSED_KEY =
  "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

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
  console.log("attaching Ballot contract");
  let ballotAddress = "";
  if (process.env.CONTRACT_ADDRESS && process.env.CONTRACT_ADDRESS.length > 0) {
    ballotAddress = process.env.CONTRACT_ADDRESS;
  }else{
    console.log("PLease deploy smart contract first and fill the deployed address into the .env file.")
    exit();
  }
  const ballotContract = new ethers.Contract(
    ballotAddress,
    ballotJson.abi,
    signer
  );
  console.log("Completed");
  console.log(`Contract attached at ${ballotContract.address}`);
  return { ballotContract, provider, signer };
}

function setListeners(
  ballotContract: ethers.Contract,
  provider: ethers.providers.BaseProvider
) {
  console.log("Setting listeners on");
  const eventFilter = ballotContract.filters.NewVoter();
  provider.on(eventFilter, (log) => {
    console.log("New voter");
    console.log({ log });
  });
  const eventFilter2 = ballotContract.filters.Voted();
  provider.on(eventFilter2, (log) => {
    console.log("New vote cast");
    console.log({ log });
  });
  const eventFilter3 = ballotContract.filters.Delegated();
  provider.on(eventFilter3, (log) => {
    console.log("New vote delegation");
    console.log({ log });
  });
}

async function Populate(
  ballotContract: ethers.Contract,
  provider: ethers.providers.BaseProvider,
  signer: ethers.Signer
) {
  console.log("Populating transactions");
  const wallet1 = ethers.Wallet.createRandom().connect(provider);
  const wallet2 = ethers.Wallet.createRandom().connect(provider);
  const wallet3 = ethers.Wallet.createRandom().connect(provider);
  const wallet4 = ethers.Wallet.createRandom().connect(provider);
  const chairpersonAddress = await ballotContract.chairperson();
  const signerAddress = await signer.getAddress();
  if (chairpersonAddress !== signerAddress)
    throw new Error("Caller is not the chairperson for this contract");
  console.log(`Giving right to vote to ${wallet1.address}`);
  const tx1 = await ballotContract.giveRightToVote(wallet1.address);
  console.log("Awaiting confirmations");
  await tx1.wait();
  console.log(`Transaction completed. Hash: ${tx1.hash}`);

  console.log(`Giving right to vote to ${wallet2.address}`);
  const tx2 = await ballotContract.giveRightToVote(wallet2.address);
  console.log("Awaiting confirmations");
  await tx2.wait();
  console.log(`Transaction completed. Hash: ${tx2.hash}`);

  console.log(`Giving right to vote to ${wallet3.address}`);
  const tx3 = await ballotContract.giveRightToVote(wallet3.address);
  console.log("Awaiting confirmations");
  await tx3.wait();
  console.log(`Transaction completed. Hash: ${tx3.hash}`);

  console.log(`Giving right to vote to ${wallet4.address}`);
  const tx4 = await ballotContract.giveRightToVote(wallet4.address);
  console.log("Awaiting confirmations");
  await tx4.wait();
  console.log(`Transaction completed. Hash: ${tx4.hash}`);

  console.log(`Funding account ${wallet1.address}`);
  let tx;
  tx = await signer.sendTransaction({
    to: wallet1.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet1).vote(0);
  await tx.wait();
  let winningProposal = await ballotContract.connect(wallet1).winningProposal();
  let winner = await ballotContract.connect(wallet1).proposals(winningProposal.toNumber());
  console.log(`Winning proposal: ${winningProposal.toNumber()} ${ethers.utils.parseBytes32String(winner.name)} with votesNum ${winner.voteCount.toNumber()}`);

  console.log(`Funding account ${wallet2.address}`);
  tx = await signer.sendTransaction({
    to: wallet2.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet2).delegate(wallet3.address);
  await tx.wait();

  console.log(`Funding account ${wallet3.address}`);
  tx = await signer.sendTransaction({
    to: wallet3.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet3).vote(0);
  await tx.wait();
  winningProposal = await ballotContract.connect(wallet2).winningProposal();
  winner = await ballotContract.connect(wallet2).proposals(winningProposal.toNumber());
  console.log(`Winning proposal: ${winningProposal.toNumber()} ${ethers.utils.parseBytes32String(winner.name)} with votesNum ${winner.voteCount.toNumber()}`);

  console.log(`Funding account ${wallet4.address}`);
  tx = await signer.sendTransaction({
    to: wallet4.address,
    value: ethers.utils.parseEther("0.001"),
  });
  await tx.wait();
  console.log("Interacting with contract now:");
  tx = await ballotContract.connect(wallet4).delegate(wallet2.address);
  await tx.wait();
  console.log("Done");
}

async function main() {
  const { ballotContract, provider, signer } = await attach();
  setListeners(ballotContract, provider);
  await Populate(ballotContract, provider, signer);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
