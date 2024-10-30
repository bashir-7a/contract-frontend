import React, { useEffect, useState } from "react";
import Web3 from "web3";
import './App.css';

const ADDRESS = "0x3cb82f810C2C6c233FB809951590833d6E1ba911";
const ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "_startingPoint", "type": "uint256" },
      { "internalType": "string", "name": "_startingMessage", "type": "string" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "decreaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getNumber",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "increaseNumber",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "message",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "newMessage", "type": "string" }],
    "name": "setMessage",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

function App() {
  const [number, setNumber] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [contract, setContract] = useState(null);
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    const init = async () => {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== 'undefined') {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const contractInstance = new web3Instance.eth.Contract(ABI, ADDRESS);
        setWeb3(web3Instance);
        setContract(contractInstance);

        await fetchNumber(contractInstance);
        await fetchMessage(contractInstance);
      } else {
        alert("MetaMask is not installed. Please install it to use this app.");
      }
    };
    init();
  }, []);

  const fetchNumber = async (contractInstance) => {
    if (contractInstance) {
      const result = await contractInstance.methods.getNumber().call();
      setNumber(result.toString());
    }
  };

  const fetchMessage = async (contractInstance) => {
    if (contractInstance) {
      const message = await contractInstance.methods.message().call();
      setCurrentMessage(message);
    }
  };

  const increaseNumber = async () => {
    if (contract) {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.increaseNumber().send({ from: accounts[0] });
      fetchNumber(contract);
    }
  };

  const decreaseNumber = async () => {
    if (contract) {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.decreaseNumber().send({ from: accounts[0] });
      fetchNumber(contract);
    }
  };

  const updateMessage = async () => {
    if (contract) {
      const accounts = await web3.eth.getAccounts();
      await contract.methods.setMessage(newMessage).send({ from: accounts[0] });
      fetchMessage(contract);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Counter Application </h1>
        
        <div className="counter-container">
          <p>Current Number: <strong>{number}</strong></p>
          <div className="button-container">
            <button className="increase-button" onClick={increaseNumber}>Increase Number</button>
          </div>
          <div className="button-container">
            <button className="decrease-button" onClick={decreaseNumber}>Decrease Number</button>
          </div>
        </div>

        <div className="message-container">
          <p>Current Message: <strong>{currentMessage}</strong></p>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter new message"
            className="message-input"
          />
          <button className="update-button" onClick={updateMessage}>Update Message</button>
        </div>
      </header>
    </div>
  );
}

export default App;

