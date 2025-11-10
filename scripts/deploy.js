const hre = require("hardhat");

async function main() {
  const AutoDeploy = await hre.ethers.getContractFactory("AutoDeploy");
  const contract = await AutoDeploy.deploy();
  await contract.deployed();
  console.log("✅ AutoDeploy deployed to:", contract.address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
