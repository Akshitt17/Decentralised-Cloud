import React, { useState, useEffect } from "react";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";
import Web3 from "web3";
import Upload from "./truffle_abis/Upload.json";



function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    
     

    const loadBlockchainData = async () => {
      await loadWeb3();
      await loadUploadContract();

    };

    loadBlockchainData();

    if(window.ethereum)
    window.ethereum.on('accountsChanged', handleAccountsChanged);

    // Cleanup function to remove the event listener
    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    };

   

     
  }, []);

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "No ethereum browser detected! You can check out MetaMask"
      );
    }
  };

  const loadUploadContract = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();

    const uploaddata = Upload.networks[networkId];
   

    if (uploaddata) {
      const upload = new web3.eth.Contract(Upload.abi, uploaddata.address);
      
      setContract(upload);
     
    } else {
      window.alert("Error! Tether contract not deployed - no detected network");
    }
  };

  const handleAccountsChanged = (accounts) => {
    setAccount(accounts[0]);
  };

  

  // useEffect(() => {
  //   const loadBlockchainData = async () => {
  //     if (window.ethereum) {
  //       window.web3 = new Web3(window.ethereum);
  //       await window.ethereum.enable();
  //       const web3 = window.web3;
  //       const accounts = await web3.eth.getAccounts();
  //       console.log("Accounts:", accounts);
        
  //       setAccount(accounts[0]);

  //       const networkId = await web3.eth.net.getId();
  //       const deployedNetwork = UploadContract.networks[networkId];
  //       const instance = new web3.eth.Contract(
  //         UploadContract.abi
  //       );
  //       setContract(instance);
  //     } else {
  //       console.error("MetaMask is not installed.");
  //     }
  //   };

  //   loadBlockchainData();
  // }, []);

  return (
    <>
      {!modalOpen && (
        <button className="share" onClick={() => setModalOpen(true)}>
          Share
        </button>
      )}
      {modalOpen && (
        <Modal setModalOpen={setModalOpen} contract={contract} account={account}></Modal>
      )}

      <div className="App">
        <h1 style={{ color: "white" }}>Decentralised Drive</h1>
        <div className="bg"></div>
        
        <p style={{ color: "black" }}>
          Account : {account ? account : "Not connected"}
        </p>
        <FileUpload contract={contract} account={account} ></FileUpload>
        <Display contract={contract} account={account}></Display>
      </div>
    </>
  );
}

export default App;
