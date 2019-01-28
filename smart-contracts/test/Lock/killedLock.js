const Units = require('ethereumjs-units')
const Web3Utils = require('web3-utils')

const deployLocks = require('../helpers/deployLocks')
const Unlock = artifacts.require('../Unlock.sol')

let unlock, locks, owner, txObj

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
        assert.fail()
      } catch (error) {
        assert.equal(
          error.message,
          'VM Exception while processing transaction: revert'
        )
      }
    })

    it('should allow the owner to kill the lock', async () => {
      owner = await locks['FIRST'].owner()
      assert.equal(owner, accounts[0])
      txObj = await locks['FIRST'].kill(owner, { from: accounts[0] })
      console.log(txObj.logs[0])
      assert.equal(txObj.logs[0], 11)
    })

    it('should trigger the Killed event', async () => {
      assert.equal(txObj.logs[0].event, 'Killed')
    })

    it('should fail if anyone trys to purchase a key', async () => {
      try {
        await locks[`FIRST`].purchaseFor(accounts[3], 'Nick', {
          from: accounts[1]
        })
        assert.fail()
      } catch (error) {
        assert.equal(
          error.message,
          'VM Exception while processing transaction: revert'
        )
      }
    })

    it('should fail if anyone trys to purchase a key for someone else', async () => {
      try {
        await locks[`FIRST`].purchaseForFrom(accounts[3], accounts[4], 'Nick', {
          from: accounts[1]
        })
        assert.fail()
      } catch (error) {
        assert.equal(
          error.message,
          'VM Exception while processing transaction: revert'
        )
      }
    })

    it.skip('should throw an exception if ether is sent to the fallback', async () => {
      try {
        locks['FIRST'].send(1, `Ether`)
        assert.fail()
      } catch (error) {
        assert.equal(
          error.message,
          'VM Exception while processing transaction: revert'
        )
      }
    })
  })
})
