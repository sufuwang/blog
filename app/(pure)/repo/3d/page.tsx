'use client'
import { use } from 'react'
import NotFound from '@/app/(default)/not-found'
import dynamic from 'next/dynamic'

export default function Repo3DPage({ searchParams }) {
  const { scene } = use<{ scene?: string }>(searchParams)
  try {
    const Comp = dynamic(() => import(`./scene/${scene}.tsx`), { ssr: false })
    return <Comp />
  } catch {
    return <NotFound />
  }
}
