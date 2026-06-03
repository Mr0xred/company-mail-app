import { useState } from 'react';
import { Copy, Plus, RefreshCw, Check } from 'lucide-react';

export default function Generator() {
  const [emails, setEmails] = useState([
    'aurora.scott37@mr0xred.my.id',
    'avaevans78@mr0xred.my.id',
    'benjaminzhang@mr0xred.my.id'
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
    <div style={{ padding: '32px', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      <h1 style={{ marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>Email Generator</h1>
      
      <div style={{ background: 'var(--bg-secondary)', padding: '24px', borderRadius: '8px', border: '1px solid var(--border-color)', marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', marginBottom: '16px', color: 'var(--text-secondary)' }}>Create New Catch-All Alias</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Custom prefix (optional)..."
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            style={{ flex: 1, padding: '10px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '4px' }}
          />
          <button 
            onClick={generateRandomEmail}
            style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', padding: '0 24px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            <Plus size={18} />
            Generate
          </button>
        </div>
      </div>

      <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '14px', fontWeight: '600' }}>Recent Generated Emails</h3>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{emails.length} total</span>
        </div>
        
        <div>
          {emails.map((email, index) => (
            <div key={index} style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>{email}</span>
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
  );
}
