import './global.css'
import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'
import '@ant-design/v5-patch-for-react-19'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Sufu.Wang',
    template: `%s | Sufu.Wang`,
  },
  description: 'Secret Pages of the Sufu.Wang',
  icons: {
    icon: '/static/images/avatar.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  )
}
