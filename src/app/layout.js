import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Sanity Client',
  description: 'A query runner for Sanity.io',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      <body className="">{children}</body>
    </html>
  )
}
