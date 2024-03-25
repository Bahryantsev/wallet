import { Button } from './ui/button'

const SubmitButton = ({
  errorText,
  disabledWhileError = false,
}: {
  errorText: string
  disabledWhileError?: boolean
}) => {
  if (errorText)
    return (
      <Button
        className="w-full"
        type="submit"
        variant={'destructive'}
        disabled={disabledWhileError}
      >
        {errorText}
      </Button>
    )
  return (
    <Button className="w-full" type="submit" variant={'default'}>
      Submit
    </Button>
  )
}

export default SubmitButton
