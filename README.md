> Looking for static analysis? See [solidity-guard](https://github.com/edTonye/solidity-guard), which scans Solidity contracts for common security patterns before deployment.

# CI/CD Hardhat Automation 🛠️

Demo project for automated deployment of smart contracts using GitHub Actions and Hardhat.

## 📋 Features
- AutoDeploy.sol contract
- Scripts for deployment
- Automated deployment workflow via GitHub Actions
- Unit test coverage

## 🚀 How to Run Locally
```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network localhost
