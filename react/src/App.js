import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import View from './app/view.js'
import Main from './app/main.js'
import Splash from './app/Splash.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/main" element={<Main />} />
        <Route path="/generate-images" element={<View />} />
      </Routes>
    </Router>
  );
}

export default App;