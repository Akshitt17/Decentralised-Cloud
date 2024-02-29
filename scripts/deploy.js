const Upload = artifacts.require("Upload");

module.exports = async function (deployer) {
  try {
    await deployer.deploy(Upload);
    const upload = await Upload.deployed();
    console.log("Library deployed to:", upload.address);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};
