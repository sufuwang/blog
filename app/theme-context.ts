import { createContext } from 'react'
import type { Dispatch } from 'react'
import siteMetadata from '@/data/siteMetadata'

const ThemeContext = createContext<{
  theme: string | null
  setTheme: Dispatch<string>
}>({ theme: localStorage.getItem('theme'), setTheme: () => null })

export default ThemeContext
