import React from 'react';
import { AuthProvider, ProtectedRoute, Dashboard } from './components/auth';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </div>
    </AuthProvider>
  );
}

export default App;
export { Dashboard };