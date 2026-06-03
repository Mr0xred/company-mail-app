import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import Inbox from './pages/Inbox';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Generator from './pages/Generator';

// Placeholder for unbuilt pages
function Placeholder({ title }) {
  return (
    <div className="empty-state" style={{ width: '100%' }}>
      <h2>{title}</h2>
      <p>This view is under construction.</p>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Inbox />} />
          <Route path="unread" element={<Placeholder title="Unread Emails" />} />
          <Route path="compose" element={<Placeholder title="Compose Email" />} />
          <Route path="generator" element={<Generator />} />
          <Route path="admin" element={<Admin />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
