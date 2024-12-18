import { createContext } from 'react'
import type { Dispatch } from 'react'

export type Theme = 'dark' | 'light' | 'system'

const ThemeContext = createContext<{
  theme: Theme
  setTheme: Dispatch<Theme>
}>({ theme: 'light', setTheme: () => null })

export default ThemeContext
