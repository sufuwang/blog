import NotFound from '@/app/(default)/not-found'
import dynamic from 'next/dynamic'

export default function Repo3DPage({ searchParams }) {
  const { scene } = searchParams
  try {
    const Comp = dynamic(() => import(`./scene/${scene}.tsx`))
    return <Comp />
  } catch {
    return <NotFound />
  }
}
