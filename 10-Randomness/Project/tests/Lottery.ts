import { expect } from "chai";
import { ethers } from "hardhat";
import { Lottery } from "../typechain";

function convertStringArrayToBytes32(array: string[]) {
    const bytes32Array = [];
    for (let index = 0; index < array.length; index++) {
      bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
    }
    return bytes32Array;
}

describe("Lottery", function () {
    let lotteryContract: Lottery;
    let lotteryFactory: any;
    let tokenContractFactory: any;
    // let tokenContract: MyToken;
    // let accounts: SignerWithAddress[];
})
