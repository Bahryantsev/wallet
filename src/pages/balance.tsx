import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MNEMONIC_KEY } from '@/constants/storage'
import { WalletContext } from '@/context/wallet'
import useLocalStorage from '@/hooks/useLocalStorage'
import { ICoin } from '@/types/wallet'
import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Balance() {
  const navigate = useNavigate()
  const { wallet } = useContext(WalletContext)
  const [balance, setBalance] = useState<ICoin | undefined>(undefined)
  const [isBalanceLoading, setIsBalaceLoading] = useState<boolean>(false)
  const [errorText, setErrorText] = useState<string>('')
  const [cipher] = useLocalStorage(MNEMONIC_KEY)

  useEffect(() => {
    if (!cipher) return navigate('/getstarted')
    if (!wallet) return navigate('/login')
    setIsBalaceLoading(true)
    setErrorText('')
    wallet
      .getNativeTokenBalance()
      .then((balance) => setBalance(balance))
      .catch(() => setErrorText("Can't get balance"))
      .finally(() => setIsBalaceLoading(false))
  }, [wallet, cipher])

  const cardTitle = useMemo(() => {
    if (isBalanceLoading) return <CardTitle>Loading...</CardTitle>
    if (errorText)
      return <CardTitle className="text-red">{errorText}</CardTitle>

    return (
      <CardTitle>
        {balance?.amount} {balance?.symbol}
      </CardTitle>
    )
  }, [balance, isBalanceLoading, errorText])
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        {cardTitle}
        <CardDescription>Your current balance</CardDescription>
      </CardHeader>
    </Card>
  )
}
