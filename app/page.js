"use client";

import { ethers } from "ethers";
import { useEffect, useState } from "react";

export default function Home() {
  // State to store various Ethereum data
  const [transaction, setTransaction] = useState([]);
  const [balance, setBalance] = useState("0");
  const [gasPrice, setGasPrice] = useState("0");
  const [latestBlock, setLatestBlock] = useState(0);

  // Ethereum address to interact with
  const address = "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5";

  // Initialize provider
  const provider = new ethers.EtherscanProvider(
    "homestead",
    process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY // Your Etherscan API key from environment variables
  );

  // Fetch account balance
  const fetchBalance = async () => {
    try {
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.formatEther(balance);
      setBalance(formattedBalance);
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  // Fetch gas price
  const fetchGasPrice = async () => {
    try {
      const gasPrice = await provider.getGasPrice();
      const formattedGasPrice = ethers.formatUnits(gasPrice, "gwei"); // Convert gas price to Gwei for readability
      setGasPrice(formattedGasPrice);
    } catch (error) {
      console.error("Error fetching gas price:", error);
    }
  };

  // Fetch the latest block number
  const fetchLatestBlock = async () => {
    try {
      const latestBlock = await provider.getBlockNumber();
      setLatestBlock(latestBlock);
    } catch (error) {
      console.error("Error fetching latest block:", error);
    }
  };

  // Fetch transaction count for an address
  const fetchTransactionCount = async () => {
    try {
      const transactionCount = await provider.getTransactionCount(address);
      console.log("Transaction Count:", transactionCount);
    } catch (error) {
      console.error("Error fetching transaction count:", error);
    }
  };

  // Fetch transaction details by hash
  const fetchTransactionDetails = async () => {
    try {
      // Fetch block details for a specific block number (e.g., block 20765185)
      const blockDetails = await provider.getBlock(20765185);
      const blockTransactions = blockDetails.transactions;
      if (blockTransactions.length !== 0) {
        setTransaction(blockTransactions);
      }
      console.log("Transactions:", transaction);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  // Fetch block and transaction details
  const fetchBlockTransactions = async (blockNumber) => {
    try {
      const blockDetails = await provider.getBlock(blockNumber);
      console.log("Block Details:", blockDetails);

      const blockTransactions = blockDetails.transactions;
      if (blockTransactions.length !== 0) {
        setTransaction(blockTransactions);
      }
    } catch (error) {
      console.error("Error fetching block transactions:", error);
    }
  };

  // Main function to fetch all Ethereum data
  const fetchEthereumData = async () => {
    await fetchBalance();
    await fetchGasPrice();
    await fetchLatestBlock();
    await fetchTransactionCount();
    await fetchTransactionDetails();
    await fetchBlockTransactions(latestBlock); // Fetch transactions from the latest block
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEthereumData();
  }, []);

  return (
    <div>
      <h3>Ethereum Account Balance:</h3>
      <p>{balance} ETH</p>

      <h4>Current Gas Price:</h4>
      <p>{gasPrice} Gwei</p>

      <h4>Latest Block Number:</h4>
      <p>{latestBlock}</p>

      <h4>Recent Transactions:</h4>
      {transaction.length > 0 ? (
        transaction.map((txHash, index) => (
          <div key={index}>
            <h6>Transaction Hash: {txHash}</h6>
          </div>
        ))
      ) : (
        <p>No transactions found in the specified block.</p>
      )}
    </div>
  );
}
