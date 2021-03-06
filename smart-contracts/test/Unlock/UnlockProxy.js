process.env.NODE_ENV = 'test'

const Unlock = artifacts.require('Unlock')
const UnlockTestV2 = artifacts.require('UnlockTestV2')
const UnlockTestV3 = artifacts.require('UnlockTestV3')
const Zos = require('zos')
const TestHelper = Zos.TestHelper
const shouldFail = require('../helpers/shouldFail')
const shared = require('./behaviors/shared')
const Units = require('ethereumjs-units')

contract('Unlock', function (accounts) {
  const proxyAdmin = accounts[1]
  const unlockOwner = accounts[2]

  describe('Proxy Unlock contract', function () {
    beforeEach(async function () {
      // TestHelper retrieves project structure from the zos.json file and deploys everything to the current test network.
      this.project = await TestHelper({ from: proxyAdmin })
      this.proxy = await this.project.createProxy(Unlock, {
        Unlock,
        initMethod: 'initialize',
        initArgs: [unlockOwner]
      })
      this.unlock = await Unlock.at(this.proxy.address)
    })

    describe('should function as a proxy', function () {
      shared.shouldBehaveLikeV1(accounts, unlockOwner)

      it("should fail if called from the proxy owner's account", async function () {
        await shouldFail(this.unlock.grossNetworkProduct({ from: proxyAdmin }), 'Cannot call fallback function from the proxy admin')
      })
    })

    describe('should function after upgrade', function () {
      beforeEach(async function () {
        this.project.setImplementation(UnlockTestV2, 'Unlock')
        await this.project.upgradeProxy(this.proxy.address, UnlockTestV2, {
          Unlock,
          initMethod: 'initializeV2',
          initArgs: []
        })
        this.unlock = await UnlockTestV2.at(this.proxy.address)
      })
      shared.shouldBehaveLikeV1(accounts, unlockOwner)

      it('should allow new functions', async function () {
        const results = await this.unlock.testNewMethod()
        assert.equal(results.toString(), '42')
      })

      it('should allow changing functions', async function () {
        const results = await this.unlock.computeAvailableDiscountFor(0, 0)
        assert.equal(results[0].toString(), '42')
        assert.equal(results[1].toString(), '42')
      })
    })

    it('should persist state between upgrades', async function () {
      const transaction = await this.unlock.createLock(
        60 * 60 * 24 * 30, // expirationDuration: 30 days
        Units.convert(1, 'eth', 'wei'), // keyPrice: in wei
        100, // maxNumberOfKeys
        {
          from: accounts[0]
        }
      )
      const newLockAddress = transaction.logs[0].args.newLockAddress
      const resultsBefore = await this.unlock.locks(newLockAddress)
      this.project.setImplementation(UnlockTestV2, 'Unlock')
      await this.project.upgradeProxy(this.proxy.address, UnlockTestV2, {
        Unlock,
        initMethod: 'initializeV2',
        initArgs: []
      })
      this.unlock = await UnlockTestV2.at(this.proxy.address)
      this.project.setImplementation(Unlock, 'Unlock')
      const resultsAfter = await this.unlock.locks(newLockAddress)
      assert.equal(JSON.stringify(resultsAfter), JSON.stringify(resultsBefore))
    })

    describe('should allow you to make significant changes to the contract', function () {
      beforeEach(async function () {
        this.project.setImplementation(UnlockTestV3, 'Unlock')
        await this.project.upgradeProxy(this.proxy.address, UnlockTestV3, {
          Unlock,
          initMethod: 'initializeV3',
          initArgs: []
        })
        this.unlock = await UnlockTestV3.at(this.proxy.address)
      })

      it('should allow new functions', async function () {
        const results = await this.unlock.testNewMethod()
        assert.equal(results.toString(), '42')
      })

      it('should allow removing functions', async function () {
        assert.equal(this.unlock.createLock, undefined)
      })

      it('should allow changing functions', async function () {
        await this.unlock.recordConsumedDiscount(0)
      })
    })
  })
})
