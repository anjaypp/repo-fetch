import { useState } from 'react'
import './App.css'
import HomePage from './pages/HomePage/HomePage'
import SearchResultItem from './components/SearchResultItem/SearchResultItem'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <HomePage/>
    </>
  )
}

export default App
