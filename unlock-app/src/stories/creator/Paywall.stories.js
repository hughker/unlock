import { Provider } from 'react-redux'
import React from 'react'
import { storiesOf } from '@storybook/react'
import Paywall from '../../pages/paywall'
import createUnlockStore from '../../createUnlockStore'
import { ConfigContext } from '../../utils/withConfig'

const lock = {
  address: '0xaaaaaaaaa0c4d48d1bdad5dcb26153fc8780f83e',
  name: 'My Blog',
  keyPrice: '27000000000000000',
  expirationDuration: 172800,
  maxNumberOfKeys: 240,
  outstandingKeys: 3,
}
const lockedState = {
  locks: {
    '0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e': {
      address: '0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e',
      keyPrice: '10000000000000000000',
      expirationDuration: 86400,
      maxNumberOfKeys: 800,
      outstandingKeys: 32,
    },
    '0xaaaaaaaaa0c4d48d1bdad5dcb26153fc8780f83e': lock,
  },
  router: {
    location: {
      pathname: '/demo/' + lock.address,
      search: '',
      hash: '',
    },
  },
  currency: {
    USD: 195.99,
  },
}
const unlockedState = {
  ...lockedState,
  account: {
    address: '0xAaAdEED4c0B861cB36f4cE006a9C90BA2E43fdc2',
    balance: '989898989898',
  },
  keys: {
    '0xab7c74abc0c4d48d1bdad5dcb26153fc87eeeeee': {
      lock: '0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e',
      owner: '0xAaAdEED4c0B861cB36f4cE006a9C90BA2E43fdc2',
      expiration: new Date('December 31, 3000 12:00:00').getTime() / 1000,
      transaction:
        '0x06094207a34b7f1c19b93d337d0c91c357d45ff8e584deb003e67b637db3d876',
    },
  },
  transactions: {
    '0x06094207a34b7f1c19b93d337d0c91c357d45ff8e584deb003e67b637db3d876': {
      hash:
        '0x06094207a34b7f1c19b93d337d0c91c357d45ff8e584deb003e67b637db3d876',
      type: 'LOCK_CREATION',
      lock: '0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e',
      status: 'mined',
      confirmations: 200,
    },
  },
  router: {
    location: {
      pathname: '/demo/0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e',
      search: '',
      hash: '',
    },
  },
}
const lockedStore = createUnlockStore(lockedState)
const unlockedStore = createUnlockStore(unlockedState)

const config = {
  env: 'dev',
  providers: {
    HTTP: [],
  },
}

storiesOf('Paywall', module)
  .add('the paywall overlay', () => {
    return (
      <ConfigContext.Provider value={config}>
        <Provider store={lockedStore}>
          <Paywall />
        </Provider>
      </ConfigContext.Provider>
    )
  })
  .add('the paywall overlay, unlocked', () => {
    return (
      <ConfigContext.Provider value={config}>
        <Provider store={unlockedStore}>
          <Paywall />
        </Provider>
      </ConfigContext.Provider>
    )
  })
