import AuthButton from '@/components/AuthButton'

export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {
  return (
    <div>
      <AuthButton />
      {searchParams?.message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {searchParams.message}
        </p>
      )}
    </div>
  )
}
