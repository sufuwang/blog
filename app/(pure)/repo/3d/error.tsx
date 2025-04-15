'use client' // Error boundaries must be Client Components

export default function Error({ error }: { error: Error & { digest?: string } }) {
  return (
    <div style={{ margin: '30px' }}>
      <h2>Something went wrong!</h2>
      <p>{error.toString()}</p>
    </div>
  )
}
