import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { WalletContext } from '@/context/wallet'
import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'

export default function GetStarted() {
  const navigate = useNavigate()
  const { create } = useContext(WalletContext)
  const handleCreateClick = useCallback(() => {
    create()
    navigate('/create')
  }, [navigate, create])
  const handleAuthClick = useCallback(() => {
    navigate('/restore')
  }, [navigate])
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle>Get started</CardTitle>
        <CardDescription>
          Create a new wallet or restore an existing one
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" onClick={handleCreateClick}>
          Create Wallet
        </Button>
        <Button className="w-full" onClick={handleAuthClick}>
          Restore Wallet
        </Button>
      </CardContent>
    </Card>
  )
}
