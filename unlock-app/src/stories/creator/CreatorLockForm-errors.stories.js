import { Provider } from 'react-redux'
import { action } from '@storybook/addon-actions'
import React from 'react'
import { storiesOf } from '@storybook/react'
import uniqid from 'uniqid'

import CreatorLockForm from '../../components/creator/CreatorLockForm'
import createUnlockStore from '../../createUnlockStore'

const store = createUnlockStore({
  currency: {
    USD: 195.99,
  },
  account: {
    address: '0xab7c74abc0c4d48d1bdad5dcb26153fc8780f83e',
  },
})

const lock = {
  name: 'New Lock',
  address: uniqid(), // for new locks, we don't have an address, so use a temporary one
  expirationDuration: 30 * 86400,
  keyPrice: '10000000000000000',
  maxNumberOfKeys: 10,
}

storiesOf('CreatorLockForm/invalid', module)
  .addDecorator(getStory => <Provider store={store}>{getStory()}</Provider>)
  .add('missing name', () => {
    return (
      <CreatorLockForm
        lock={{ ...lock, name: '' }}
        valid={false}
        hideAction={action('hide')}
        setError={action('setError')}
        createLock={action('createLock')}
      />
    )
  })
  .add('invalid duration', () => {
    return (
      <CreatorLockForm
        lock={{ ...lock, expirationDuration: -1 }}
        valid={false}
        hideAction={action('hide')}
        setError={action('setError')}
        createLock={action('createLock')}
      />
    )
  })
  .add('invalid num keys', () => {
    return (
      <CreatorLockForm
        lock={{ ...lock, maxNumberOfKeys: -2 }}
        valid={false}
        hideAction={action('hide')}
        setError={action('setError')}
        createLock={action('createLock')}
      />
    )
  })
  .add('invalid key price', () => {
    return (
      <CreatorLockForm
        lock={{ ...lock, keyPrice: '-1' }}
        valid={false}
        hideAction={action('hide')}
        setError={action('setError')}
        createLock={action('createLock')}
      />
    )
  })
