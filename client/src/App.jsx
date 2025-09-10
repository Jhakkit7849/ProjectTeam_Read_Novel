import { useEffect, useState } from 'react';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    fetch('/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => {
        console.error(err);
        setMessage('Error connecting to backend');
      });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>React + Vite Frontend</h1>
      <p>Response from backend: {message}</p>
    </div>
  );
}

export default App;
