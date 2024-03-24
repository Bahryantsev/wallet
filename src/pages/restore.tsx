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
import { FormEvent, useCallback, useContext, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Restore() {
  const [errorText, setErrorText] = useState<string>('')
  const { restore } = useContext(WalletContext)
  const navigate = useNavigate()
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      setErrorText('')
      try {
        e.preventDefault()
        const form = e.currentTarget
        const formData = new FormData(form)
        const mnemonic = formData.get('mnemonic')?.toString() ?? ''
        restore(mnemonic)
        navigate('/')
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : UNKNOWN_ERROR_MSG
        setErrorText(message)
      }
    },
    [setErrorText, navigate, restore]
  )

  const submitButton = useMemo(() => {
    if (errorText)
      return (
        <Button
          className="w-full"
          type="submit"
          variant={'destructive'}
          disabled
        >
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
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center space-y-2">
        <CardTitle>Authentication</CardTitle>
        <CardDescription>
          Enter your mnemonic phrase to authenticate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2 mb-2">
            <Label htmlFor="mnemonic">Mnemonic Phrase</Label>
            <Input
              id="mnemonic"
              placeholder="Enter your mnemonic phrase"
              type="text"
              name="mnemonic"
            />
          </div>
          {submitButton}
        </form>
      </CardContent>
    </Card>
  )
}
