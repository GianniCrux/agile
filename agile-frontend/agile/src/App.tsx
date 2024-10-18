import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Tasks from './pages/Tasks'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
        <div className="container mx-auto flex justify-between items-center">
          <ul className='flex space-x-4'>
            <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
            <li><Link to="/tasks" className="hover:text-blue-500 transition-colors">Tasks</Link></li>
          </ul>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
      <main className="container mx-auto mt-8 px-4">
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/tasks' element={<Tasks darkMode={darkMode} />}/>
        </Routes>
      </main>
    </div>
  )
}

export default App