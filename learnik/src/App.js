import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CreateNotes from './components/CreateNotes';
import GenerateTest from './components/GenerateTest';
import SimplifyBook from './components/SimplifyBook';
import Result from './pages/Result';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-notes" element={<CreateNotes />} />
        <Route path="/generate-test" element={<GenerateTest />} />
        <Route path="/simplify-book" element={<SimplifyBook />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </Router>
  );
}

export default App;