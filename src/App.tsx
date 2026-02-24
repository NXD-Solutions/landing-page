import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Stats } from './components/Stats'
import { Features } from './components/Features'
import { HowItWorks } from './components/HowItWorks'
import { EarlyAccess } from './components/EarlyAccess'
import { Footer } from './components/Footer'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <EarlyAccess />
      </main>
      <Footer />
    </>
  )
}

export default App
