// Importing SHA256 for Hashing
const SHA256 = require('crypto-js/sha256');

class Transaction {
    constructor (fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}


// Block Class - 
class Block {
    constructor (timestamp, transactions, previousHash = '') {
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Hash of Block mined is " + this.hash);
    }
}


//Block-Chain Class
class BlockChain {
    constructor () {
        this.chain = [this.createGenesis()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesis () {
        return new Block('08/04/2021', 'Genesis Block', '0000');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransactions(miningRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        console.log('Block Mined Successfully');
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;
        for (const block of this.chain) {
            for(const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

}

// Creating a new Block Chain -
let myCoin = new BlockChain();

myCoin.createTransaction(new Transaction('person-1','person-2', 100 ));
myCoin.createTransaction(new Transaction('person-2','person-1', 50 ));

console.log('Found a miner...');
myCoin.minePendingTransactions('kedar-hegde');

myCoin.getBalanceOfAddress('kedar-hegde');

console.log('Found another miner...');
myCoin.minePendingTransactions('kedar-hegde');

console.log("\nKedar's balance is " + myCoin.getBalanceOfAddress('kedar-hegde'));

// Printing the entire Block-chain -
// console.log(JSON.stringify(myCoin, null, 4));


// Checking validity of Block-Chain before altering data-
// console.log("Is Block-Chain Valid ? " + myCoin.isChainValid());


// Checking validity of Block-Chain after altering data-
// myCoin.chain[1].transactions["amount"] = 500;
// console.log("Is Block-Chain Valid ? " + myCoin.isChainValid());