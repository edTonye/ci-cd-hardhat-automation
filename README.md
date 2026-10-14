# ci-cd-hardhat-automation

A reference implementation of automated Solidity contract deployment using
Hardhat and GitHub Actions.

This project demonstrates a **CI/CD pattern** for smart contracts:
install → compile → test → smoke-deploy on every push. The value of the
repository is the automation pattern, not the contract logic.

> Looking for static analysis? See
> [solidity-guard](https://github.com/edTonye/solidity-guard), which scans
> Solidity contracts for common security patterns before deployment.
> The two projects are independent — neither integrates with the other.

---

## What this repo contains

- A minimal Solidity contract (`contracts/AutoDeploy.sol`) with a single
  state-changing function and one public state variable
- A deploy script (`scripts/deploy.js`) using Hardhat + ethers v6
- Four contract tests under `test/`
- A GitHub Actions workflow that runs on every push and pull request

The contract is intentionally trivial. The point of the repo is the
automation around it.

---

## Why this exists

Deploying smart contracts manually is error-prone. Missed test runs,
stale artifacts, wrong networks, and forgotten deployments are common.

This repo shows a reproducible pattern for:

1. Installing dependencies deterministically (`npm ci` + committed lockfile)
2. Compiling contracts in CI
3. Running tests before any deployment
4. Exercising the deploy script automatically
5. Keeping the workflow under version control

---

## Prerequisites

- Node.js 20 (or newer LTS)
- npm (ships with Node.js)
- Git

Verify your environment:

    node --version   # v20.x or newer
    npm --version    # 10.x or newer

---

## Quick start

    git clone https://github.com/edTonye/ci-cd-hardhat-automation.git
    cd ci-cd-hardhat-automation
    npm ci
    npx hardhat compile
    npx hardhat test
    npx hardhat run scripts/deploy.js --network hardhat

`npm ci` is used instead of `npm install` so the committed
`package-lock.json` produces reproducible installs.

---

## How the CI workflow works

Workflow: `.github/workflows/ci.yml`
Name: **Hardhat CI and Deployment Smoke Test**

Triggers:
- Every push to `main`
- Every pull request targeting `main`

Steps:

1. Checkout the repository (`actions/checkout@v4`)
2. Set up Node.js 20 with npm cache (`actions/setup-node@v4`)
3. Install dependencies (`npm ci`)
4. Compile contracts (`npx hardhat compile`)
5. Run tests (`npx hardhat test`)
6. Deploy smoke test (`npx hardhat run scripts/deploy.js --network hardhat`)

Step 6 deploys to Hardhat's **ephemeral in-process network**. Nothing
persists — the point is to prove the deploy script executes cleanly
against a real EVM without needing funded wallets or RPC credentials.

CI must fail if compilation or tests fail. The green badge on the repo
reflects only the current state of `main`.

---

## The contract

`contracts/AutoDeploy.sol`:

    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20;

    contract AutoDeploy {
        uint256 public value;

        function setValue(uint256 _value) external {
            value = _value;
        }
    }

Ten lines. The point is the pipeline, not the logic.

---

## Tests

Four tests in `test/autoDeployTest.js`:

1. **deploys with initial value 0** — confirms a fresh deployment
   starts with `value == 0`
2. **updates value when setValue is called** — confirms a single
   `setValue(42)` sets `value` to `42`
3. **keeps the latest value across multiple calls** — confirms
   sequential calls leave the last value in place
4. **exposes a deployed address** — confirms `getAddress()` returns a
   well-formed 0x-prefixed address

Run them locally with:

    npx hardhat test

Expected output:

    AutoDeploy
      ✓ deploys with initial value 0
      ✓ updates value when setValue is called
      ✓ keeps the latest value across multiple calls
      ✓ exposes a deployed address

    4 passing

---

## Expected deploy output

    $ npx hardhat run scripts/deploy.js --network hardhat
    AutoDeploy deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

**This address is specific to the ephemeral Hardhat network.** It is
deterministic for the local Hardhat chain (the first deployer account is
always seeded the same way), but it is **not** a real deployed contract
on any live blockchain. Each run creates and discards a fresh in-process
EVM.

---

## Repository structure

    .
    ├── .github/
    │   └── workflows/
    │       └── ci.yml
    ├── assets/
    │   └── img.png
    ├── contracts/
    │   └── AutoDeploy.sol
    ├── scripts/
    │   └── deploy.js
    ├── test/
    │   └── autoDeployTest.js
    ├── .gitignore
    ├── hardhat.config.js
    ├── LICENSE
    ├── package.json
    ├── package-lock.json
    └── README.md

---

## Known limitations

- **Local network only.** The smoke-deploy step targets the ephemeral
  Hardhat network. Real-network deployment would require RPC credentials
  and a funded deployer key stored as GitHub secrets — deliberately out
  of scope.
- **Minimal contract.** `AutoDeploy` exists only to give the pipeline
  something to compile, test, and deploy. It is not a production
  contract, has no access control, and has no upgrade path.
- **No security audit.** This repo demonstrates CI/CD mechanics. It is
  not a security review of the contract (see
  [solidity-guard](https://github.com/edTonye/solidity-guard) for a
  static-analysis example).
- **Single compiler version.** `hardhat.config.js` pins Solidity 0.8.20.
  Multi-version or multi-network setups are out of scope.
- **Asset not referenced.** `assets/img.png` is not currently used by
  this README. It is retained for future use.

---

## Related work

- [solidity-guard](https://github.com/edTonye/solidity-guard) — a Python
  CLI that scans Solidity contracts for common security patterns.
  Independent project; no integration with this repository.

---

## License

MIT. See `LICENSE`.
