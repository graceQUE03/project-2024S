// src/App.tsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './landing';
import Problems from './problems';
import Placement from './placement';
import About from './about';
import Home from './home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dcode/*" element={<Home />}>
          <Route path="problems" element={<Problems />} />
          <Route path="placement" element={<Placement />} />
          <Route path="about" element={<About />} />
          <Route index element={<Problems />} /> {/* Default to Problems */}
        </Route>
      </Routes>
    </div>
  );
}

export default App;
