import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0x744fbE83d117954a5ef8C46e844830C1D65BAb40"
);

export default instance;
