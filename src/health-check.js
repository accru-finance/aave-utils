const Web3 = require("web3");
const axios = require("axios");
const Decimal = require("decimal.js");
const lendingPoolABI = require("./abi.json");

exports.handler = async () => {
  const poolContractAddress = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119";
  const ourWallet = process.env.OUR_WALLET;

  const web3 = new Web3(process.env.ETH_NODE);

  const poolContract = new web3.eth.Contract(
    lendingPoolABI,
    poolContractAddress
  );

  const data = await poolContract.methods.getUserAccountData(ourWallet).call();

  if (new Decimal(data.healthFactor).lessThan(new Decimal(1))) {
    await axios({
      method: "POST",
      url: process.env.SLACK_URL,
      headers: {
        "Content-type": "application/json",
      },
      data: {
        text: "Health factor dropped below 1",
      },
    });
  }
};
