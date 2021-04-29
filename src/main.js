// Importing Classes
const {BlockChain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// ENtering my private key
const myKey = ec.keyFromPrivate('d6c9b84b7c42e11b78b4b436d5955777e0d2ea26ab694bb1a07e411a9aae8853');
const myWalletAddress = myKey.getPublic('hex');


// Creating a new Block Chain -
let myCoin = new BlockChain();

// Creating a Transaction
const tx1 = new Transaction(myWalletAddress, "receiving guy's address", 10);
tx1.signTransaction(myKey);
myCoin.addTransaction(tx1);  
// Since I sent 10 coins to someone else, my balance now will be -10


// Mine a block and send reward to myself
// Since reward is set to 100, my balance now will be 90
console.log('Found a miner...');
myCoin.minePendingTransactions(myWalletAddress);
console.log("\nKedar's balance is " + myCoin.getBalanceOfAddress(myWalletAddress));

// Checking validity of Block-Chain before altering data- 
console.log('Is Chain Valid? ', myCoin.isChainValid());


// Checking validity of Block-Chain after altering data-
myCoin.chain[1].transactions[0].amount = 1;
console.log('Is Chain Valid? ', myCoin.isChainValid());

// Printing the entire Block-chain -
// console.log(JSON.stringify(myCoin, null, 4));
