import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/Home';
import FurnitureHeritageUI from './src/HomeScreen/Index';
import Admin from './src/Admin/Admin';
import { useEffect } from 'react';



import PageTracker from './PageTracker';

import { initClarity } from './clarity';
import TrackingManager from './components/TrackingManager';


function App() {

  useEffect(() => {
   
    initClarity();
  }, []);

  return (
    <Router>
      <PageTracker />
      <TrackingManager />
      <Routes>
        <Route path="/" element={<FurnitureHeritageUI />} />
        <Route path="/home/:id" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;

