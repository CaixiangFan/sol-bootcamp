import { expect } from "chai";
// eslint-disable-next-line node/no-unpublished-import
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { Gas } from "../typechain";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];
const BASE_VOTE_POWER = 10;
const PROPOSAL_CHOSEN = [0, 1, 2];
const USED_VOTE_POWER = 5;
const ACCOUNTS_FOR_TESTING = 3;

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

describe("Gas", function () {

  beforeEach(async () => {
  });

  describe("gas test", async () => {
    it("updates votes correctly", async () => {
      
        
    });
  });
});
