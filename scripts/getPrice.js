const DEXE = "0xa651EdBbF77e1A2678DEfaE08A33c5004b491457";
const BUSD = "0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7";
const USDT = "0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684";
const WBNB = "0xae13d989dac2f0debff460ac112a837c89baa7cd";

const tokenIn = DEXE;
const tokenOut = BUSD;
const amountIn = "1000000000000000000";

// const tokenIn = USDT;
// const tokenOut = BUSD;
// const amountIn = "1000000000000000000";

const hre = require("hardhat");

async function main() {
    const PriceFeed = await hre.ethers.getContractFactory("PriceFeed", {
      libraries: {
        UniswapPathFinder: "0x660385160A6057B38032A440C3DdDcAE26058806",
      },
    });
    const priceFeed = await PriceFeed.attach(
      "0xdB746dDD278bd5e2709BaF38Aa86fF4ccdfFb941"
    );

    let result = await priceFeed.callStatic.getPriceOut(
        tokenIn,
        tokenOut,
        amountIn);

    let length = result.path.path.length;
    if (length == 0) {
      console.log("No valid path");
    }
    for (let i = 0; i < length - 1; i++) {
      let token = await hre.ethers.getContractAt("IERC20Metadata", result.path.path[i]);
      i == 0 
        ? console.log(amountIn, "of", await token.symbol(), "->")
        : console.log(await token.symbol(), "->");
      switch (result.path.poolTypes[i]) {
        case 0: 
          console.log("    Pancake V2");
          break;
        case 1:
          console.log("    Pancake V3 fee 100");
          break;
        case 2:
          console.log("    Pancake V3 fee 500");
          break;
        case 3:
          console.log("    Pancake V3 fee 2500");
          break;
        case 4:
          console.log("    Pancake V3 fee 10000");
          break;
        default:
          throw new Error("Unknown swap type");
      }
    }
    if (length != 0) {
      let token = await hre.ethers.getContractAt("IERC20Metadata", result.path.path[length - 1]);
      console.log(result.amountOut.toString(), "of", await token.symbol());  
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});