// Importing SHA256 for Hashing and Elliptic for Public/Private Key generation 
const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Transaction Class
class Transaction {
    constructor (fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    // Hash function for signing Transactions
    calculateHash() {
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    // Method to Sign Transactions
    signTransaction(signingKey) {

        // Check if the user is sending coins from his own wallet or not
        if (signingKey.getPublic('hex') !==  this.fromAddress) {
            throw new Error('You cannot sign transactions of other wallets!');
        }

        // Signing
        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    // Method Check if Transactions is Valid or not
    isValid() {

        // If from Address is null (Mining Rewards), then no Error
        if (this.fromAddress === null) return true;

        // If transaction has no signature, throw an error
        if (!this.signature || this.signature.length === 0) {
            throw new Error ('No signature in this Transaction!');
        }

        // Verify whether Public key and Sender's address are same or not
        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
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

    // Hash Function for the Block-Chain
    calculateHash() {
        return SHA256(this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce).toString();
    }

    // Method to mine a block (Create a Hash)
    mineBlock(difficulty) {

        // This loop is used in-order to make a certain rule for all the Hash codes
        // In this case the rule is that, every hash code will start with difficulty number of zeros
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++; // nonce (a temporary variable) is used inorder to change the Hash because the other data remain the same and we'll get same Hash if we don't change anyhting 
            this.hash = this.calculateHash();
        }

        console.log("Hash of Block mined is " + this.hash);
    }

    // Method to check if all the Transactions are valid or not
    hasValidTransactions() {
        for (const tx of this.transactions) {
            if(!tx.isValid) {
                return false;
            }
        }
        return true;
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

    // Method to create a Genesis block (first block of the Block-Chain)
    createGenesis () {
        return new Block('08/04/2021', 'Genesis Block', '0000');
    }

    // Method to get the last block of the Block-Chain 
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Method to add a Transaction into a pendingTransaction Array (to check before adding it to actual Block-Chain)
    addTransaction(transaction) {

        // Checking if from/to Address is blank or not
        if (!transaction.fromAddress || !transaction.toAddress) {
            throw new Error('Transaction must include a from and to address');
        }

        // Checking if Transactions is valid or not
        if(!transaction.isValid()) {
            throw new Error('Cannot add invalid Transactions!');
        }

        this.pendingTransactions.push(transaction);
    }

    // Method to mine Pending Transactions (pendingTransactions array to main Block-Chain)
    minePendingTransactions(miningRewardAddress) {

        // Rewarding the miner for his hardwork
        const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward);
        this.pendingTransactions.push(rewardTx);

        // Creating a new Block by calculating previous Hash and other parameters
        let pH = this.getLatestBlock().hash;
        let block = new Block(Date.now(), this.pendingTransactions, pH);
        block.mineBlock(this.difficulty);

        // Pushing it into chain array (main Block-Chain)
        console.log('Block Mined Successfully');
        this.chain.push(block);
        this.pendingTransactions = [];
    }
    
    // Method to get Wallet balance of a given address
    getBalanceOfAddress(address) {
        let balance = 0;

        // Iterating through the chain to see all the transactions and calculating Balance
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

    // Method to check if the Chain is Valid or not
    isChainValid() {

        // Iterating through the chain to check if all the Blocks are valid or not
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Checking if the Transactions are Valid or not
            if(!currentBlock.hasValidTransactions()) {               
                return false;
            }

            // Checking if the Hash is Valid or not
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            // Checking if the linking is valid or not (Using Previous hash)
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }

}



module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;