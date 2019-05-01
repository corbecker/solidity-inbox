const assert = require('assert'); //built in node library used for asserting in tests
const ganache = require('ganache-cli');
const provider = ganache.provider();
const Web3 = require('web3'); // constructor function so capitalised
const { interface, bytecode } = require('../compile');
const INITIAL_STRING = 'Hi There.';

// Web3 & local Ethereum network need a provider to talk to one another
const web3 = new Web3(provider); 

let accounts;
let inbox;

beforeEach(async () => {

  // Get a list of all the accounts from Ganache local network
  accounts = await web3.eth.getAccounts();

  // Use one of the accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    .send({ from: accounts[0], gas: 1000000 }); 
  });
  
describe('Inbox', () => {
  it('deploys contract', () => {
    assert.ok(inbox.options.address); // ok method asserts that the passed value is defined. If truthy ok if falsy not ok. 
  });
  it('has default message', async () => {
    const message = await inbox.methods.message().call(); // calls the message method in the inbox contract
    assert.equal(message, INITIAL_STRING);
  })
})