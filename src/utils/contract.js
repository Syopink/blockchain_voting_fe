import { ethers } from "ethers";
import VotingABI from "./Voting.json";

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";

export const getContract = async () => {
  if (!window.ethereum) {
    alert("Vui lòng cài MetaMask!");
    return null;
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, signer);
};
