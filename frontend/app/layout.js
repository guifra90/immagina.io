import './globals.css'
import { Inter, Oswald } from 'next/font/google'
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

export const metadata = {
  title: 'Immagina.io | Design That Leaves a Mark',
  description: 'Building brands that look and feel better. AI-driven consultancy and creative design.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="it" className={`${inter.variable} ${oswald.variable}`}>
      <body className="bg-[#111111] text-white antialiased">
        <SmoothScroll>
          <CustomCursor />
          <Navbar />
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
