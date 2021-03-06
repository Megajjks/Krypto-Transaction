import React, {useEffect, useState} from "react";
import { ethers } from "ethers";

import { contractABI, contractAddres } from  "../utils/constant";

export const TransactionContext = React.createContext();

const { ethereum } = window;

const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddres, contractABI, signer);

  return transactionContract;

}


export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [formData, setFormData] = useState({
    addressTo:"",
    amount: "",
    keyword: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

  const handleChange = (e, name) =>{
    setFormData((prevState)=>({
      ...prevState, 
      [name]: e.target.value
    }))
  }

  const checkIfWalletIsConnected = async () => {
    try{
      if(!ethereum) return alert("please install metamask");
      const accounts = await ethereum.request({ method: "eth_accounts"});
      if(accounts.length){
        setCurrentAccount(accounts[0]);
        console.log(accounts);
        // getAllTransactions();
      }else{
        console.log("no accounts found")
      }
    }catch(e){
      console.error(e)
      throw new Error("No ethereum object")
    }
  }

  const connectWallet = async () => {
    try{
      if(!ethereum) return alert("please install metamask");
      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      
      setCurrentAccount(accounts[0]);
    }catch(e){
      console.error(e)
      throw new Error("No ethereum object")
    }
  }

  const SendTransaction = async () => {
    try{
      if(!ethereum) return alert("please install metamask");
      
      const {
        addressTo,
        amount,
        keyword,
        message
      } = formData;

      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount)

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [{
          from: currentAccount,
          to: addressTo,
          gas: "0x5208", //21000 GWEI
          value: parsedAmount._hex //0.00001
        }]
      })

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true)
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      
      const transactionCount = await transactionContract.getTransactionCount();
      setTransactionCount(transactionCount.toNumber())

    }catch(e){
      console.error(e)
      throw new Error("No ethereum object")
    }
  }

  useEffect(()=>{
    checkIfWalletIsConnected();
  }, []);

  return (
    <TransactionContext.Provider 
      value={{ 
        currentAccount,
        formData,
        SendTransaction,
        connectWallet,
        handleChange 
      }}>
      {children}
    </TransactionContext.Provider>
  )
}