const Ethsamurai = artifacts.require("Ethsamurai");

module.exports = function(deployer) {
  deployer.deploy(Ethsamurai);
};
