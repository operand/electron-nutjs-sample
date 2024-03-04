import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const App: React.FC = () => {
  return (
    <div className="App">
    </div>
  );
};

// Attach the React component to the DOM
const container = document.getElementById('root')
const root = createRoot(container!);
root.render(<App />);

export default App;
