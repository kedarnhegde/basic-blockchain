// Importing SHA256 for Hashing
const SHA256 = require('crypto-js/sha256');


// Block Class - 
class Block {
    constructor (index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    calculateHash() {
        return SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString();
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
        this.difficulty = 5;
    }

    createGenesis () {
        return new Block(0,'08/04/2021', 'Genesis Block', '0000');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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

// Adding Blocks
myCoin.addBlock(new Block(1,'08-04-2021', {'from': 'Alex', 'to':'John', 'amount':'100'}));

myCoin.addBlock(new Block(2,'08-04-2021', {'from': 'Sam', 'to':'Tom', 'amount':'200'}));


// Printing the entire Block-chain -
// console.log(JSON.stringify(myCoin, null, 4));


// Checking validity of Block-Chain before altering data-
// console.log("Is Block-Chain Valid ? " + myCoin.isChainValid());


// Checking validity of Block-Chain after altering data-
// myCoin.chain[1].data["amount"] = 500;
// console.log("Is Block-Chain Valid ? " + myCoin.isChainValid());