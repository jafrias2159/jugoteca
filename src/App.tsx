import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import GamePage from './pages/GamePage'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/juego/:gameId" element={<GamePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
