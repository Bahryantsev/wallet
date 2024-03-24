import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { WalletContext } from '@/context/wallet'
import { useCallback, useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Create() {
  const navigate = useNavigate()
  const { wallet } = useContext(WalletContext)
  const mnemonicUI = useMemo(() => {
    if (!wallet)
      return <div className="col-span-4 text-center">Something went wrong</div>
    const mnemonic = wallet.getMnemonic()
    return mnemonic.split(' ').map((word: string, index: number) => (
      <Badge
        className="bg-gray-300 dark:bg-gray-800 flex justify-center"
        variant="secondary"
        key={index + word}
      >
        {word}
      </Badge>
    ))
  }, [wallet])
  const handleCopy = useCallback(() => {
    if (!wallet) return
    navigator.clipboard.writeText(wallet.getMnemonic())
  }, [wallet])

  const handleContinue = useCallback(() => {
    if (!wallet) return navigate('/')
    navigate('/createpw')
  }, [wallet, navigate])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle>Your Secret Mnemonic</CardTitle>
        <CardDescription>
          A mnemonic is a set of words that can be used to recover your account.
          Keep it secret and safe.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 grid grid-cols-4 gap-4">
        {mnemonicUI}
      </CardContent>
      <div className="grid grid-cols-2 gap-2">
        <Button variant={'secondary'} disabled={!wallet} onClick={handleCopy}>
          Copy to clipboard
        </Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </Card>
  )
}
