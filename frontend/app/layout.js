import './globals.css'
import { Inter, Oswald, Cormorant_Garamond } from 'next/font/google'
import SmoothScroll from '../components/SmoothScroll'
import Navbar from '../components/Navbar'

import CustomCursor from '../components/CustomCursor'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Including light weights
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata = {
  title: 'Immagina.io | Design That Leaves a Mark',
  description: 'Building brands that look and feel better. AI-driven consultancy and creative design.',
}

export const viewport = {
  themeColor: '#111111',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${inter.variable} ${oswald.variable} ${cormorant.variable}`} style={{ backgroundColor: '#111111' }} suppressHydrationWarning>
      <body className="bg-[#111111] text-white antialiased" style={{ backgroundColor: '#111111' }} suppressHydrationWarning>
        <Navbar />
        <SmoothScroll>
          <CustomCursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
// Forced rebuild
