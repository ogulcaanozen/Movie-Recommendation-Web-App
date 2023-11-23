import React from 'react';
import './App.css';
import Homepage from './pages/Homepage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ShowDetail from './pages/ShowDetail';
import ResultsPage from './pages/ResultsPage';
import RecommendationPage from './pages/RecommendationPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { MyContextProvider } from './context/Context';

function App() {
  return (
    <Router>
      <MyContextProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/detail/:id" element={<ShowDetail movieId="948713" />} />
          <Route path="/results/:query/detail/:id" element={<ShowDetail movieId="948713" />} />
          <Route path="/results/:query" element={<ResultsPage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
        </Routes>
      </MyContextProvider>
    </Router>
  );
}

export default App;
