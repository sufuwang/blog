'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme } from 'antd'
import { useEffect, useState } from 'react'
import ThemeContext, { Theme } from './theme-context'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  const [curTheme, setTheme] = useState<Theme>(siteMetadata.theme)

  useEffect(() => {
    const t = localStorage.getItem('theme') as Theme
    if (t) {
      setTheme(t)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme: curTheme, setTheme }}>
      <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme} enableSystem>
        <ConfigProvider
          theme={{
            algorithm: curTheme === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
          }}
        >
          <AntdRegistry>{children}</AntdRegistry>
        </ConfigProvider>
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
