const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../ethereum/build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "autumn toss clerk outer mountain hood envelope regular joke among hello rabbit",
  "https://rinkeby.infura.io/v3/25c0ba8be6754cc28fab30b9be552ce7"
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("accout used to deploy", accounts[0]);
  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({
      data: compiledFactory.bytecode,
    })
    .send({ from: accounts[0], gas: "1000000" });

  console.log("contract deployed to ", result.options.address);
  provider.engine.stop();
};

deploy();
