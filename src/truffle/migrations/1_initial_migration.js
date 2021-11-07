const Migrations = artifacts.require("Migrations");
const VNFDeployment = artifacts.require("VNFDeployment");

module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(VNFDeployment);
};
