import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {
    BrowserRouter, Routes, Route
} from 'react-router-dom';

import Admin from './admin';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<>Home</>} />
                <Route path="admin/*" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
