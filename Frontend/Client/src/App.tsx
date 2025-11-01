import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import ChatWidget from './components/assistant/ChatWidget'
import { ThemeProvider } from './contexts/ThemeContext'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <div className="min-h-dvh flex flex-col">
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-indigo-600 focus:text-white">Skip to content</a>
        <Header />
        <main id="main" className="flex-1 w-full px-4 py-6">{children}</main>
        <Footer />
        <ChatWidget />
      </div>
    </ThemeProvider>
  )
}

export default AppLayout
