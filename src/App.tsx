import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './src/Home';

import FurnitureHeritageUI from './src/HomeScreen/Index';

function App() {
  return (
    <Router>
      <Routes>
        {/* This is your landing page with the cards */}
        <Route path="/" element={<FurnitureHeritageUI />} />

        {/* This is the page you go to when you click a card */}
        <Route path="/home/:id" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;