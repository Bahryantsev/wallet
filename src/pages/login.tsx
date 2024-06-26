import SubmitButton from '@/components/submitButton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { WalletContext } from '@/context/wallet'
import { FormEvent, useCallback, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LogIn() {
  const [errorText, setErrorText] = useState<string>('')
  const { restore, login } = useContext(WalletContext)
  const navigate = useNavigate()

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      setErrorText('')
      try {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const pw = formData.get('password')?.toString() ?? ''
        await login(pw)
        navigate('/')
      } catch (e: unknown) {
        setErrorText('Password is not valid')
      }
    },
    [setErrorText, navigate, restore, login]
  )

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>Enter your password to login.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              name="password"
              id="password"
              placeholder="Enter your password"
              type="password"
            />
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton errorText={errorText} />
        </CardFooter>
      </form>
    </Card>
  )
}
