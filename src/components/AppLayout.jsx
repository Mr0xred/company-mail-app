import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import GenerateModal from './GenerateModal';

export default function AppLayout({ onLogout }) {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);
  const [theme, setTheme] = useState('light');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="app-container">
      <Sidebar 
        collapsed={collapsed} 
        toggleSidebar={() => setCollapsed(!collapsed)} 
        onGenerateClick={() => setIsGenerateModalOpen(true)}
      />
      <div className="main-wrapper">
        <TopHeader toggleTheme={toggleTheme} theme={theme} toggleSidebar={() => setCollapsed(!collapsed)} onLogout={onLogout} />
        <main className="content-container">
          <Outlet />
        </main>
      </div>

      {isGenerateModalOpen && (
        <GenerateModal onClose={() => setIsGenerateModalOpen(false)} />
      )}
    </div>
  );
}
