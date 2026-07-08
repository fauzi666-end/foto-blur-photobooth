import { BrowserRouter, Route, Routes } from 'react-router-dom'

import BlurCamPage from '@/pages/BlurCamPage'
import Home from '@/pages/Home'
import PhotoboothPage from '@/pages/PhotoboothPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blur-cam" element={<BlurCamPage />} />
        <Route path="/photobooth" element={<PhotoboothPage />} />
      </Routes>
    </BrowserRouter>
  )
}
