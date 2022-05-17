import { expect } from "chai";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { EncodeBootcampToken } from "../typechain";

const PREMINT = ethers.utils.parseEther("100");

describe("Testing Token", function () {
  let tokenContract: EncodeBootcampToken;
  let accounts: any[];

  this.beforeEach(async function () {
    accounts = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("EncodeBootcampToken");
    tokenContract = await tokenFactory.deploy(PREMINT);
    await tokenContract.deployed();
  });

  describe("has zero supply", function () {
    it("has the provided proposals", async function () {
      const totalSuplyBN = await tokenContract.totalSupply();
      const expectedBN = PREMINT;
      const diffBN = totalSuplyBN
    });
  });
});
