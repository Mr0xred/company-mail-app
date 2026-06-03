import { useState } from 'react';
import { X, Copy, Check, Plus } from 'lucide-react';

export default function GenerateModal({ onClose }) {
  const [emails, setEmails] = useState([
    'aurora.scott37@mr0xred.my.id',
    'avaevans78@mr0xred.my.id'
  ]);
  const [prefix, setPrefix] = useState('');
  const [copied, setCopied] = useState(null);

  const generateRandomEmail = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < 8; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const newEmail = `${prefix || 'user'}_${randomString}@mr0xred.my.id`;
    setEmails([newEmail, ...emails]);
    setPrefix('');
  };

  const handleCopy = (email) => {
    navigator.clipboard.writeText(email);
    setCopied(email);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Generate Email Alias</h3>
          <button className="icon-btn" onClick={onClose} style={{ width: '32px', height: '32px' }}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input 
              type="text" 
              placeholder="Custom prefix (optional)..."
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '8px' }}
            />
            <button 
              onClick={generateRandomEmail}
              style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              <Plus size={18} />
              Generate
            </button>
          </div>

          <div style={{ borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
              <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)' }}>Recent Aliases ({emails.length})</span>
            </div>
            
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {emails.map((email, index) => (
                <div key={index} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--text-primary)' }}>{email}</span>
                  <button 
                    onClick={() => handleCopy(email)}
                    style={{ background: 'transparent', border: 'none', color: copied === email ? 'var(--success-color)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}
                  >
                    {copied === email ? <><Check size={16} /> Copied</> : <><Copy size={16} /> Copy</>}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
