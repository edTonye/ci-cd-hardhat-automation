const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutoDeploy Contract", function () {
  it("Sets and reads value correctly", async function () {
    const AutoDeploy = await ethers.getContractFactory("AutoDeploy");
    const contract = await AutoDeploy.deploy();
    await contract.deployed();

    await contract.setValue(42);
    const val = await contract.value();
    expect(val).to.equal(42);
  });
});
