import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  Inbox, Star, Send, File, Clock, AlertOctagon, Trash2, Tag, ChevronDown, PenSquare
} from 'lucide-react';

export default function Sidebar({ collapsed, toggleSidebar, onGenerateClick, onItemClick }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleUnreadUpdate = (e) => setUnreadCount(e.detail);
    window.addEventListener('unread_update', handleUnreadUpdate);
    return () => window.removeEventListener('unread_update', handleUnreadUpdate);
  }, []);

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-logo">
            <div style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center' }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '-0.5px' }}>Gmail</span>
          </div>
        )}
      </div>

      <div className="sidebar-content">
        <div className="compose-btn-container">
          <button className="btn-compose" onClick={onGenerateClick}>
            <PenSquare size={20} />
            {!collapsed && <span>Generate Alias</span>}
          </button>
        </div>

        <NavLink to="/" onClick={onItemClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={collapsed ? 'Inbox' : ''}>
          <Inbox className="icon" size={18} />
          {!collapsed && <span>Inbox</span>}
          {!collapsed && unreadCount > 0 && <span style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '12px' }}>{unreadCount}</span>}
        </NavLink>
        
        <NavLink to="/starred" onClick={onItemClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={collapsed ? 'Starred' : ''}>
          <Star className="icon" size={18} />
          {!collapsed && <span>Starred</span>}
        </NavLink>
        
        <NavLink to="/snoozed" onClick={onItemClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={collapsed ? 'Snoozed' : ''}>
          <Clock className="icon" size={18} />
          {!collapsed && <span>Snoozed</span>}
        </NavLink>
        
        <NavLink to="/sent" onClick={onItemClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={collapsed ? 'Sent' : ''}>
          <Send className="icon" size={18} />
          {!collapsed && <span>Sent</span>}
        </NavLink>
        
        <NavLink to="/drafts" onClick={onItemClick} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} title={collapsed ? 'Drafts' : ''}>
          <File className="icon" size={18} />
          {!collapsed && <span>Drafts</span>}
        </NavLink>

        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }}>
          <ChevronDown size={18} style={{ marginLeft: '2px' }} />
          {!collapsed && <span style={{ fontSize: '14px', fontWeight: 500 }}>More</span>}
        </div>

        {!collapsed && <div className="sidebar-section-title" style={{ marginTop: '16px' }}>Labels</div>}
        <div style={{ padding: '0 12px', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-secondary)', cursor: 'pointer', height: '32px' }}>
          <Tag size={18} />
          {!collapsed && <span style={{ fontSize: '14px', fontWeight: 500 }}>Work</span>}
        </div>
      </div>
    </aside>
  );
}
