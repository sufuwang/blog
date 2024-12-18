'use client'

import { ThemeProvider } from 'next-themes'
import siteMetadata from '@/data/siteMetadata'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { ConfigProvider, theme } from 'antd'
import { useState } from 'react'
import ThemeContext from './theme-context'

export function ThemeProviders({ children }: { children: React.ReactNode }) {
  const [curTheme, setTheme] = useState(siteMetadata.theme)

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
