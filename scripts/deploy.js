const hre = require("hardhat");

async function main() {
  const UniswapPathFinder = await hre.ethers.getContractFactory("UniswapPathFinder");
  const pathFinder = await UniswapPathFinder.deploy();
  await pathFinder.deployed();
  const PriceFeed = await hre.ethers.getContractFactory("PriceFeed", {
    libraries: {
      UniswapPathFinder: pathFinder.address,
    },
  });
  const priceFeed = await PriceFeed.deploy();

  await priceFeed.deployed();

  console.log(
    `PriceFeed deployed to ${priceFeed.address}`
  );
  console.log(
    `Library deployed to ${pathFinder.address}`
  );

  let tx = await priceFeed.__PriceFeed_init([
    ["0", "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3", "0"],
    ["1", "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2", "100"],
    ["1", "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2", "500"],
    ["1", "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2", "2500"],
    ["1", "0xbC203d7f83677c7ed3F7acEc959963E7F4ECC5C2", "10000"],
  ]);
 await tx.wait();

 console.log("Pools are set");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
