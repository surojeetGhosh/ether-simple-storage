const ethers = require("ethers");
const fs = require("fs");
require("dotenv").config();

const RpcUrl = process.env.RPC_URL_2;

async function main() {
    // this is how our application will connect to blockchain
    const provider = new ethers.providers.JsonRpcProvider(RpcUrl);

    // connecting any ganache wallet and passing private key
    // but in real world don't put private key in javascript -> use dotenv
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY_2, provider);
    // now reading abi of compiled contract
    const SimpleStorageBin = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.bin",
        "utf8"
    );
    const SimpleStorageAbi = fs.readFileSync(
        "./SimpleStorage_sol_SimpleStorage.abi",
        "utf8"
    );

    // creating a contractFactory which can deploy contracts
    const contractFactory = new ethers.ContractFactory(
        SimpleStorageAbi,
        SimpleStorageBin,
        wallet
    );

    // u can pass many arguments to override existing settings of contract like {gasPrice: 1000000000, gasLimit: 1000000000}
    // if gas limit is more than it is reverted
    const contract = await contractFactory.deploy();
    console.log(contract);
    // getting transaction receipt
    // number of confirmations required here it is 1
    const deploymentReceipt = await contract.deployTransaction.wait(1);

    // it gives receipt before confirmations
    console.log(contract.deployTransaction);

    // it gives after confirmation
    console.log(deploymentReceipt);

    // contract address
    console.log(contract.address);
    // raw transaction
    // since it is contract to is null
    // through this we get number of transaction done till now
    // add + 1 to the next transaction

    //   const nonce = await wallet.getTransactionCount();
    //   const tx = {
    //     nonce: nonce + 1,
    //     gasPrice: 2e10,
    //     gasLimit: 1e8,
    //     to: null,
    //     value: 0,
    //     data: "0x608060405234801561001057600080fd5b50610150806100206000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80636057361d1461003b57806367e0badb14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212208cc3612699d1e2371ec676202fa5cea54d44b6668c3e919394dc3cae5b17ac9664736f6c63430008130033",
    //     chainId: 5777
    //   };
    //   // sending the transaction
    //   const sentTransaction = await wallet.sendTransaction(tx);

    //   // waiting for confirmaion
    //   await sentTransaction.wait(1);
    //   console.log(sentTransaction);

    // calling contract functions
    let currentNum = await contract.getNum();
    console.log(currentNum.toString()); // returned number is big number
    // toString number is converted into proper number
    // always wait for recipt after some confirmations
    const transactionResponse = await contract.store("7"); // it needs string arguments
    const transactionReceipt = await transactionResponse.wait(1);
    console.log(transactionReceipt); // since it requires state variable

    currentNum = await contract.getNum();
    console.log(currentNum.toString());
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch((error) => {
        console.error(error);
    });

// you can also encrypt wallet and then store
//it in json file and use the wallet using function to get wallet in encrypted form
