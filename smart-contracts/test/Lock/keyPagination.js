const Units = require('ethereumjs-units')
const Web3Utils = require('web3-utils')
const deployLocks = require('../helpers/deployLocks')
const Unlock = artifacts.require('../Unlock.sol')

let unlock, locks

contract('Lock', (accounts) => {
  before(() => {
    return Unlock.deployed()
      .then(_unlock => {
        unlock = _unlock
        return deployLocks(unlock)
      })
      .then(_locks => {
        locks = _locks
      })
  })

  describe('getKeysByPage', () => {
    it('should fail with a negative start index', () => {
      return locks['FIRST'].purchaseFor(accounts[0], 'Julien', {
        value: Units.convert('0.01', 'eth', 'wei')
      })
        .then(() => {
          return locks['FIRST'].getKeysByPage(-1, {
            from: accounts[5]
          })
        })
        .then(() => {
          assert(false, 'This should have failed')
        })
        .catch(error => {
          assert.equal(error.message, 'VM Exception while processing transaction: revert Index must be in-bounds')
        })
    })

    it('should fail with too high of a start index', () => {
      return locks['FIRST'].purchaseFor(accounts[0], 'Julien', {
        value: Units.convert('0.01', 'eth', 'wei')
      })
        .then(() => {
          return locks['FIRST'].getKeysByPage(11, {
            from: accounts[5]
          })
        })
        .then(() => {
          assert(false, 'This should have failed')
        })
        .catch(error => {
          assert.equal(error.message, 'VM Exception while processing transaction: revert Index must be in-bounds')
        })
    })

    it('should fail when there are no keys', () => {
      return locks['FIRST'].getKeysByPage(1, {
        from: accounts[5]
      })
        .then((tx) => {
          console.log(tx)
          assert(false, 'This should have failed')
        })
        .catch(error => {
          assert.equal(error.message, 'VM Exception while processing transaction: revert Index must be in-bounds')
        })
    })

    it('should return the requested keys', () => {
      let keys, expirationTimestamp1, expirationTimestamp2, keyData1, keyData2

      return locks['FIRST'].purchaseFor(accounts[0], Web3Utils.fromAscii('Julien'), {
        value: Units.convert('0.01', 'eth', 'wei')
      })
        .then(() => {
          return locks['FIRST'].purchaseFor(accounts[4], Web3Utils.fromAscii('Nick'), {
            value: Units.convert('0.01', 'eth', 'wei')
          })
        })
        .then(() => {
          return locks['FIRST'].purchaseFor(accounts[5], Web3Utils.fromAscii('Ben'), {
            value: Units.convert('0.01', 'eth', 'wei')
          })
        })
        .then(() => {
          return locks['FIRST'].purchaseFor(accounts[6], Web3Utils.fromAscii('Akeem'), {
            value: Units.convert('0.01', 'eth', 'wei')
          })
        })
        .then(() => {
          return locks['FIRST'].purchaseFor(accounts[7], Web3Utils.fromAscii('Greg'), {
            value: Units.convert('0.01', 'eth', 'wei')
          })
        })
        .then(() => {
          return locks['FIRST'].outstandingKeys()
        })
        .then(_keys => {
          keys = _keys
        })
        .then(() => {
          Promise.all([
            locks['FIRST'].keyExpirationTimestampFor(accounts[0]),
            locks['FIRST'].keyExpirationTimestampFor(accounts[4])
          ]).then(([_expirationTimestamp1, _expirationTimestamp2]) => {
            expirationTimestamp1 = _expirationTimestamp1
            expirationTimestamp2 = _expirationTimestamp2
          })
        })
        .then(() => {
          Promise.all([
            locks['FIRST'].keyDataFor(accounts[0]),
            locks['FIRST'].keyDataFor(accounts[4])
          ]).then(([_keyData1, _keyData2]) => {
            keyData1 = _keyData1
            assert.equal(Web3Utils.toUtf8(keyData1), 'Julien')
            keyData2 = _keyData2
            assert.equal(Web3Utils.toUtf8(keyData2), 'Nick')
          })
        })
        .then(() => {
          return locks['FIRST'].getKeysByPage.call(0, { from: accounts[5] })
        })
        .then((results) => {
          console.log(`${Web3Utils.toUtf8(results[1][0])}`)
          console.log(`${Web3Utils.toUtf8(results[1][1])}`)
          console.log(`${Web3Utils.toUtf8(results[1][2])}`)
          console.log(`${Web3Utils.toUtf8(results[1][3])}`)
          console.log(`${Web3Utils.toUtf8(results[1][4])}`)
          assert.equal(5, keys.toNumber(10))
          assert.equal(results[0][0].toNumber(10), expirationTimestamp1.toNumber(10))
          assert.equal(results[1][0], keyData1)
          assert.equal(results[0][1].toNumber(10), expirationTimestamp2.toNumber(10))
          assert.equal(results[1][1], keyData2)
        })
    })
  })
})
