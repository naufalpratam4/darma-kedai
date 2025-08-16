import { useState } from 'react'
import './App.css'
import NavbarPage from './components/NavbarPage'
import HeroPage from './components/HeroPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <NavbarPage/>
      <HeroPage/>
    </>
  )
}

export default App
