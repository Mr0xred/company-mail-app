import { useState, useEffect } from 'react';
import { Star, MoreVertical, Reply, CornerUpRight, Trash2, MailIcon, Archive, Clock, Mail } from 'lucide-react';
import { io } from 'socket.io-client';

export default function Inbox() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  useEffect(() => {
    const unreadCount = emails.filter(e => !e.isRead || e.isNew).length;
    window.dispatchEvent(new CustomEvent('unread_update', { detail: unreadCount }));
  }, [emails]);

  useEffect(() => {
    const isProd = import.meta.env.PROD;
    const BACKEND_URL = isProd ? '' : `http://${window.location.hostname}:5000`;
    
    const fetchEmails = () => {
      fetch(`${BACKEND_URL}/api/emails`)
        .then(res => {
          if (!res.ok) throw new Error('Gagal memuat email dari server');
          return res.json();
        })
        .then(data => {
          if (data.error) throw new Error(data.error);
          
          setEmails(data);
          
          if (data.length > 0 && !selectedEmail) {
            setSelectedEmail(data[0]);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error(err);
          // For mockup purposes, let's load dummy data if server fails
          setEmails([
            { id: 1, sender: 'google-noreply@google.com', senderName: 'Google', subject: 'Security alert', snippet: 'A new sign-in on Windows was detected...', date: new Date().toISOString(), isRead: false, body: 'We noticed a new sign-in to your Google Account on a Windows device. If this was you, you don\'t need to do anything.' },
            { id: 2, sender: 'newsletter@medium.com', senderName: 'Medium Daily', subject: 'How to build a SaaS in 2024', snippet: 'Read the latest trends on building software...', date: new Date(Date.now() - 86400000).toISOString(), isRead: true, body: 'Building a SaaS is harder than ever but more rewarding.' },
            { id: 3, sender: 'billing@github.com', senderName: 'GitHub', subject: 'Payment Receipt', snippet: 'Thanks for using GitHub Pro...', date: new Date(Date.now() - 172800000).toISOString(), isRead: true, body: 'Here is your receipt for GitHub Pro. Total: $4.00.' }
          ]);
          setIsLoading(false);
        });
    };

    fetchEmails();
    
    // Connect to Socket.IO for real-time updates
    const isProd = import.meta.env.PROD;
    const socket = io(isProd ? undefined : `http://${window.location.hostname}:5000`, {
      path: '/socket.io'
    });
    
    socket.on('new_email', (newEmail) => {
      setEmails(prev => {
        // Cek apakah email sudah ada agar tidak ganda
        if (prev.some(e => e.id === newEmail.id)) return prev;
        // Letakkan email baru paling atas
        return [newEmail, ...prev];
      });

      // Tampilkan notifikasi desktop
      if (Notification.permission === 'granted') {
        new Notification('Email Baru Masuk!', {
          body: newEmail.subject,
          icon: '/favicon.ico'
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Email Baru Masuk!', {
              body: newEmail.subject
            });
          }
        });
      }
    });

    return () => socket.disconnect();
  }, []);

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleSelectEmail = (email) => {
    const updatedEmail = { ...email, isRead: true, isNew: false };
    setSelectedEmail(updatedEmail);
    if (!email.isRead || email.isNew) {
      setEmails(prev => prev.map(e => e.id === email.id ? updatedEmail : e));
    }
  };

  const handleSelectToggle = (id, isChecked) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (isChecked) newSet.add(id);
      else newSet.delete(id);
      return newSet;
    });
  };

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      setSelectedIds(new Set(emails.map(e => e.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const handleDeleteSelected = () => {
    // Menghapus dari tampilan frontend
    setEmails(prev => prev.filter(e => !selectedIds.has(e.id)));
    if (selectedEmail && selectedIds.has(selectedEmail.id)) {
      setSelectedEmail(null);
    }
    setSelectedIds(new Set());
  };

  return (
    <div className={`inbox-container ${selectedEmail ? 'show-detail' : 'show-list'}`}>
      <div className="email-list-pane">
        <div className="email-list-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingLeft: '8px' }}>
            <input 
              type="checkbox" 
              checked={emails.length > 0 && selectedIds.size === emails.length}
              ref={input => {
                if (input) {
                  input.indeterminate = selectedIds.size > 0 && selectedIds.size < emails.length;
                }
              }}
              onChange={(e) => handleSelectAll(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: 'var(--accent-color)', cursor: 'pointer' }} 
            />
            {selectedIds.size > 0 ? (
              <button className="icon-btn" onClick={handleDeleteSelected} style={{ width: 'auto', height: 'auto', padding: '4px', color: 'var(--danger-color)' }} title="Hapus">
                <Trash2 size={18} />
              </button>
            ) : (
              <>
                <button className="icon-btn" style={{ width: 'auto', height: 'auto', padding: '4px' }}><Clock size={18} /></button>
                <button className="icon-btn" style={{ width: 'auto', height: 'auto', padding: '4px' }}><MoreVertical size={18} /></button>
              </>
            )}
          </div>
        </div>
        <div className="email-list-scroll">
          {isLoading && <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading emails...</div>}
          {!isLoading && emails.map((email) => (
            <div 
              key={email.id} 
              className={`email-item ${selectedEmail?.id === email.id ? 'selected' : ''} ${!email.isRead ? 'unread' : 'read'}`}
              onClick={() => handleSelectEmail(email)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '16px' }} className="email-item-actions">
                <input 
                  type="checkbox" 
                  checked={selectedIds.has(email.id)}
                  onChange={(e) => handleSelectToggle(email.id, e.target.checked)}
                  onClick={(e) => e.stopPropagation()} 
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-color)', cursor: 'pointer' }} 
                />
                <Star size={18} fill={email.isStarred ? '#f4b400' : 'none'} color={email.isStarred ? '#f4b400' : 'var(--text-muted)'} />
              </div>
              
              {email.isNew && <div className="new-email-dot"></div>}
              
              <div className="email-item-content">
                <div className="email-item-header">
                  <span className="email-sender">{email.senderName || email.sender.split('@')[0]}</span>
                  <span className="email-time">{email.date ? formatTime(email.date) : ''}</span>
                </div>
                <div className="email-subject">
                  {email.subject || '(no subject)'}
                </div>
                <div className="email-snippet">
                  {email.snippet || email.body?.substring(0, 50) || ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="email-detail-pane">
        {selectedEmail ? (
          <div className="thread-container">
            <div className="thread-header">
              <button className="icon-btn mobile-back-btn" onClick={() => setSelectedEmail(null)} style={{ marginRight: '16px', display: 'none' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
              </button>
              <h1 className="thread-subject">{selectedEmail.subject || '(no subject)'}</h1>
              <div className="thread-actions">
                <button className="icon-btn"><Archive size={18} /></button>
                <button className="icon-btn"><Trash2 size={18} /></button>
                <button className="icon-btn"><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="message-card">
              <div className="message-header">
                <div className="message-sender-info">
                  <div className="avatar-large">
                    {selectedEmail?.senderName ? selectedEmail.senderName.charAt(0).toUpperCase() : (selectedEmail?.sender ? selectedEmail.sender.charAt(0).toUpperCase() : '?')}
                  </div>
                  <div className="message-sender-details">
                    <div className="message-sender-name">
                      {selectedEmail?.senderName || (selectedEmail?.sender ? selectedEmail.sender.split('@')[0] : 'Unknown')}
                      <span className="message-sender-email">{selectedEmail?.sender ? `<${selectedEmail.sender}>` : ''}</span>
                    </div>
                    <div className="message-to-me">to me <MoreVertical size={14} style={{ display: 'inline', verticalAlign: 'middle' }}/></div>
                  </div>
                </div>
                <div className="message-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)' }}>
                  <span className="message-date">{selectedEmail.date ? `${formatDate(selectedEmail.date)}, ${formatTime(selectedEmail.date)}` : ''}</span>
                  <Star size={18} fill={selectedEmail.isStarred ? '#f4b400' : 'none'} color={selectedEmail.isStarred ? '#f4b400' : 'currentColor'} style={{ cursor: 'pointer' }} />
                  <Reply size={18} style={{ cursor: 'pointer' }} />
                  <MoreVertical size={18} style={{ cursor: 'pointer' }} />
                </div>
              </div>
              <div className="message-body">
                {selectedEmail.body}
              </div>
              
              <div style={{ padding: '0 0 24px 52px', display: 'flex', gap: '12px' }} className="message-reply-actions">
                <button className="btn-primary"><Reply size={16} /> Reply</button>
                <button className="btn-primary"><CornerUpRight size={16} /> Forward</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <MailIcon size={64} style={{ opacity: 0.1, marginBottom: '16px' }} />
            <h3>No conversation selected</h3>
            <p>Select an email from the list to read.</p>
          </div>
        )}
      </div>
    </div>
  );
}
