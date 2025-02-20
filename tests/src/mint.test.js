import "core-js/stable";
import "regenerator-runtime/runtime";
import { waitForAppScreen, zemu, genericTx, SPECULOS_ADDRESS} from './test.fixture';
import { ethers } from "ethers";
import { parseEther, parseUnits} from "ethers/lib/utils";

const contractAddr = "0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4";
const abi_path = '..compound/abis/' + contractAddr + '.json';
const abi = require(abi_path);

// Reference transaction for this test:
// https://etherscan.io/tx/0x79875ff30e4220e81708c1e0765d2621d91f9992b4a28e3fe71f88c126afb21a

// Nanos S test
test('[Nano S] Swap Exact Eth For Tokens with beneficiary', zemu("nanos", async (sim, eth) => {
  // Constants used to create the transaction
  const amount = parseUnits("28471151959593036279", 'wei');

 
  const contract = new ethers.Contract(contractAddr, abi);

  // signature: mint(uint256 amount )
  const {data} = await contract.populateTransaction.mint(amount);

  // Get the generic transaction template
  let unsignedTx = genericTx;
  // Modify `to` to make it interact with the contract
  unsignedTx.to = contractAddr;
  // Modify the attached data
  unsignedTx.data = data;

  // Create serializedTx and remove the "0x" prefix
  const serializedTx = ethers.utils.serializeTransaction(unsignedTx).slice(2);

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx
  );

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button 7 times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', 'nanos_swap_exact_eth_for_tokens_with_beneficiary', [10, 0]);

  await tx;
}));

// NanoX test
test('[Nano X] Swap Exact Eth For Tokens with beneficiary', zemu("nanox", async (sim, eth) => {

  // Rather than constructing the tx ourselves, one can can obtain it directly through etherscan (with a little bit of editing)
  const serializedTx = "02f901170181d38459682f0085215d7c1e598302a4e9947a250d5630b4cf539739df2c5dacb4c659f2488d88016345785d8a0000b8e47ff36ab50000000000000000000000000000000000000000000000018b1dd9dc51b5a9f7000000000000000000000000000000000000000000000000000000000000008000000000000000000000000015557c8b7246c38ee71ea6dc69e4347f5dac210400000000000000000000000000000000000000000000000000000000615336100000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000006b3595068778dd592e39a122f4f5a5cf09c90fe2c0";

  const tx = eth.signTransaction(
    "44'/60'/0'/0",
    serializedTx,
  );

  // Wait for the application to actually load and parse the transaction
  await waitForAppScreen(sim);
  // Navigate the display by pressing the right button 7 times, then pressing both buttons to accept the transaction.
  await sim.navigateAndCompareSnapshots('.', 'nanox_swap_exact_eth_for_tokens_with_beneficiary', [6, 0]);

  await tx;
}));
