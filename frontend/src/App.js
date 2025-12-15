import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductDetail from './pages/product-detail';
import Profile from './pages/profile';
import Events from './pages/events';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/events" element={<Events />} />
            </Routes>
        </Router>
    );
}

export default App;
