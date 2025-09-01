import React from 'react';
import '../App.css';

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/zoho/auth';
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>React Laravel Zoho</h1>
        <p>Spend and Expense Management</p>
        <button onClick={handleLogin} className="login-button">
          Login with Zoho
        </button>
      </header>
    </div>
  );
}

export default Login;
