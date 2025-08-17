import './App.css'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import { AuthProvider } from './context/AuthContext'
import { AnalysisProvider } from './context/AnalysisContext'

function App() {
  

  return (
    <AuthProvider>
      <AnalysisProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AnalysisProvider>
    </AuthProvider>
  )
}

export default App

