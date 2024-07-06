// App.tsx
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './landing';
import Problems from './problems';
import Placement from './placement';
import About from './about';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={<Landing />} />
        <Route path="/dcode" element={<Landing />} />
        <Route path="/dcode/problems" element={<Problems />} />
        <Route path="/dcode/placement" element={<Placement />} />
        <Route path="/dcode/about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
