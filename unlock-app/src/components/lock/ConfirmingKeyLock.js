import React from 'react'
import styled from 'styled-components'
import UnlockPropTypes from '../../propTypes'
import {
  LockWrapper,
  LockHeader,
  LockBody,
  LockDetails,
  TransactionStatus,
  LockDetail,
  LockFooter,
} from './LockStyles'
import BalanceProvider from '../helpers/BalanceProvider'
import withConfig from '../../utils/withConfig'

export const ConfirmingKeyLock = ({ lock, transaction, config }) => (
  <LockWrapper>
    <LockHeader>{lock.name}</LockHeader>
    <Body>
      <BalanceProvider
        amount={lock.keyPrice}
        render={(ethPrice, fiatPrice) => (
          <>
            <LockDetails>
              <LockDetail bold>{ethPrice} ETH</LockDetail>
              <LockDetail>${fiatPrice}</LockDetail>
            </LockDetails>
          </>
        )}
      />
      <TransactionStatus>
        Waiting for confirmations
        <br />
        {transaction.confirmations}/{config.requiredConfirmations}
      </TransactionStatus>
      <Footer>Payment Pending</Footer>
    </Body>
  </LockWrapper>
)

ConfirmingKeyLock.propTypes = {
  lock: UnlockPropTypes.lock.isRequired,
  transaction: UnlockPropTypes.transaction.isRequired,
  config: UnlockPropTypes.configuration.isRequired,
}

export default withConfig(ConfirmingKeyLock)

const Body = styled(LockBody)`
  border: 1px solid var(--yellow);
`

const Footer = styled(LockFooter)`
  background-color: var(--yellow);
  color: var(--white);
  margin-top: 13px;
`
