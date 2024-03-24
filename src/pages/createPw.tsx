import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UNKNOWN_ERROR_MSG } from '@/constants/text'
import { WalletContext } from '@/context/wallet'
import useMessages from '@/hooks/useMessages'
import { FormEvent, useCallback, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function CreatePassword() {
  const { wallet, port } = useContext(WalletContext)
  const navigate = useNavigate()
  const [errorText, setErrorText] = useState<string>('')
  const { sendEncrypt } = useMessages(port)
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      setErrorText('')
      try {
        e.preventDefault()
        if (!wallet) throw new Error('No wallet found')
        const formData = new FormData(e.currentTarget)
        const pw = formData.get('password')?.toString() ?? ''
        const confirmPw = formData.get('confirm-password')?.toString() ?? ''
        if (pw !== confirmPw) throw new Error('Passwords does not match')
        const mnemonic = wallet.getMnemonic()
        sendEncrypt(mnemonic, pw)
        navigate('/')
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : UNKNOWN_ERROR_MSG
        setErrorText(message)
      }
    },
    [setErrorText, navigate, wallet]
  )

  const submitButton = useMemo(() => {
    if (errorText)
      return (
        <Button className="w-full" type="submit" variant={'destructive'}>
          {errorText}
        </Button>
      )
    return (
      <Button className="w-full" type="submit" variant={'default'}>
        Submit
      </Button>
    )
  }, [errorText])

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create password</CardTitle>
        <CardDescription>Enter your new password below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" required type="password" />
          </div>
          <div>
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input
              id="confirm-password"
              name="confirm-password"
              required
              type="password"
            />
          </div>
          {submitButton}
        </form>
      </CardContent>
    </Card>
  )
}
