'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme } from 'antd'
import { useState } from 'react'
import ThemeContext, { Theme } from './theme-context'

const Themes = {
  light: theme.defaultAlgorithm,
  dark: theme.darkAlgorithm,
  system: theme.compactAlgorithm,
}

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  const [curTheme, setTheme] = useState<Theme>(siteMetadata.theme)

  return (
    <ThemeContext.Provider value={{ theme: curTheme, setTheme }}>
      <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
        <AntdRegistry>
          <ConfigProvider theme={{ algorithm: Themes[curTheme] }}>{children}</ConfigProvider>
        </AntdRegistry>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
