const hre = require("hardhat");

async function main() {
  const AutoDeploy = await hre.ethers.getContractFactory("AutoDeploy");
  const contract = await AutoDeploy.deploy();
  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("AutoDeploy deployed to:", address);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
