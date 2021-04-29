// Importing Modules
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Creating a Public-Private key pair
const key = ec.genKeyPair();
const publicKey = key.getPublic('hex');
const privateKey = key.getPrivate('hex');

// Printing Keys
console.log('Private Key is', privateKey);
console.log('Public Key is', publicKey);