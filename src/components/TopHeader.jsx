import { Search, Menu, HelpCircle, Settings, Grid, Sun, Moon } from 'lucide-react';

export default function TopHeader({ toggleTheme, theme, toggleSidebar }) {
  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Hamburger Menu - only visible on small screens or when we want to toggle */}
        <button className="icon-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <Search size={20} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search mail" 
            className="search-input"
          />
        </div>
      </div>

      <div className="header-actions">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="icon-btn" title="Support">
          <HelpCircle size={20} />
        </button>
        <button className="icon-btn" title="Settings">
          <Settings size={20} />
        </button>
        <button className="icon-btn" title="Google apps">
          <Grid size={20} />
        </button>
        <div style={{ width: '32px', height: '32px', background: 'var(--accent-color)', color: '#fff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', marginLeft: '8px', cursor: 'pointer' }}>
          M
        </div>
      </div>
    </header>
  );
}
