const Units = require('ethereumjs-units')
const Web3Utils = require('web3-utils')

const deployLocks = require('../helpers/deployLocks')
const Unlock = artifacts.require('../Unlock.sol')

let unlock, locks, owner

contract('Lock', accounts => {
  before(async () => {
    unlock = await Unlock.deployed()
    locks = await deployLocks(unlock)
  })

  describe('killing a Lock', () => {
    // check this!
    it('should fail if anyone but the owner trys to kill the lock', async () => {
      try {
        owner = await locks['FIRST'].owner()
        assert.notEqual(owner, accounts[6])
        await locks['FIRST'].kill(accounts[6], {
          from: accounts[6]
        })
        assert.fail('Expected Revert')
      } catch (error) {
        assert.equal(
          error.message,
          'VM Exception while processing transaction: revert'
        )
      }
    })

    it.skip('should allow the owner to kill the lock', async () => {
      assert.equal(owner, accounts[0])
      let txObj = await locks['FIRST'].kill(owner, { from: owner })
      console.log(txObj.logs)
      assert.equal(txObj.logs[0], true)
    })

    it('should trigger the Killed event', async () => {})

    it('should fail if anyone trys to purchase a key', async () => {})

    it('should fail if anyone trys to purchase a key for someone else', async () => {})

    // ? only worried about payable
    // purchaseFor
    // purchaseForFrom
    // transferFrom
    // approve
    it('should fail if anyone trys to transfer a key', async () => {})

    it('should fail if anyone trys to call approve()', async () => {})

    it('should throw an exception if ether is sent to the fallback', async () => {})
  })
})
