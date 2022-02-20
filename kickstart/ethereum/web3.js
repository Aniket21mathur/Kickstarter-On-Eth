import Web3 from "web3";

var web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/25c0ba8be6754cc28fab30b9be552ce7"
  );
  web3 = new Web3(provider);
}

export default web3;
