import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
const handleLogin=()=>{
  const popup= window.open(
    'http://localhost:8080/auth/google',
    'google-oauth',
    'width=500,height=600,scrollbars=yes'
  );

  console.log("Button clicked");
};


  return (
    <div>
      <h1>Iguanas-Jewelry</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;
