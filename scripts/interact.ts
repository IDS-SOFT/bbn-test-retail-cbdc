import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file
const hre = require("hardhat");
import { ethers } from "ethers";

const contractAddress: string = process.env.CONTRACT_ADDRESS || "";
const contractABI: any[] = [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "accountAddress",
          "type": "address"
        }
      ],
      "name": "AccountCreated",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "accountAddresses",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "accounts",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "isFrozen",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "usdAmount",
          "type": "uint256"
        }
      ],
      "name": "convertToCBDC",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "cbdcAmount",
          "type": "uint256"
        }
      ],
      "name": "convertToUSD",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "createAccount",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getAccountAtIndex",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAccountCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "bankAddress",
          "type": "address"
        }
      ],
      "name": "integrateWithBankingSystem",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "makePayment",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "bytes",
          "name": "offlineSignature",
          "type": "bytes"
        }
      ],
      "name": "offlineTransfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "accountAddress",
          "type": "address"
        },
        {
          "internalType": "bool",
          "name": "isFrozen",
          "type": "bool"
        }
      ],
      "name": "setFrozenStatus",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "accountAddress",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "kycData",
          "type": "bytes"
        }
      ],
      "name": "setKYC",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bool",
          "name": "allowAnonymousTransactions",
          "type": "bool"
        }
      ],
      "name": "setPrivacySettings",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ];

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_NODE_URL || "");
  const signer = await hre.ethers.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  try {
    // Call functions here
    const createAccountTx = await contract.createAccount();
    await createAccountTx.wait();

    console.log("Account Created", signer.getAddress());
    const accountBalance = await contract.accounts(signer.getAddress());
    console.log("Account Balance:", accountBalance.toString()); // Convert BigNumber to string
    
    const accountCount = await contract.getAccountCount();
    console.log("Account Count:", accountCount.toString()); // Convert BigNumber to string
    
    const accountAddresses = [];
    for (let i = 0; i < accountCount; i++) {
        const addressAtIndex = await contract.getAccountAtIndex(i);
        accountAddresses.push(addressAtIndex);
    }
    console.log("Account Addresses:", accountAddresses);
    

    // Replace with other function calls as needed
    // const transferTx = await contract.transfer(toAddress, amount);
    // await transferTx.wait();

    // const frozenStatus = await contract.accounts(signer.getAddress());
    // console.log("Is Frozen:", frozenStatus.isFrozen);

    // Add more function calls as needed

  } catch (error) {
    console.error("Error:", error);
  }
}

main();
