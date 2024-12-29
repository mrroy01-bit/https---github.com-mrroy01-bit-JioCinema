import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import Navbar from './components/Navbar';
import CategoryTabs from './components/CategoryTabs';
import HomePage from './pages/HomePage';
import VideoPage from './pages/VideoPage';
import './App.css';

function App() {
  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#0f0617',
      overflow: 'hidden'
    }}>
      <Navbar />
      <CategoryTabs />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/video/:id" element={<VideoPage />} />
      </Routes>
    </Box>
  );
}

export default App;
