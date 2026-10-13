const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutoDeploy", function () {
  let contract;

  beforeEach(async function () {
    const AutoDeploy = await ethers.getContractFactory("AutoDeploy");
    contract = await AutoDeploy.deploy();
    await contract.waitForDeployment();
  });

  it("deploys with initial value 0", async function () {
    expect(await contract.value()).to.equal(0n);
  });

  it("updates value when setValue is called", async function () {
    await contract.setValue(42);
    expect(await contract.value()).to.equal(42n);
  });

  it("keeps the latest value across multiple calls", async function () {
    await contract.setValue(1);
    await contract.setValue(2);
    await contract.setValue(99);
    expect(await contract.value()).to.equal(99n);
  });

  it("exposes a deployed address", async function () {
    const address = await contract.getAddress();
    expect(address).to.match(/^0x[0-9a-fA-F]{40}$/);
  });
});
