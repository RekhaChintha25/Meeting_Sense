import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Login, { getLoginRequired, isAuthenticated, clearAuthenticated } from './components/Login';

function AuthGate() {
  const loginRequired = getLoginRequired();
  const [loggedIn, setLoggedIn] = useState(() => isAuthenticated());

  if (loginRequired && !loggedIn) {
    return <Login onSuccess={() => setLoggedIn(true)} />;
  }

  const handleLogout = () => {
    clearAuthenticated();
    setLoggedIn(false);
  };

  return <App onLogout={loginRequired ? handleLogout : undefined} />;
}

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <AuthGate />
    </React.StrictMode>
  );
}
