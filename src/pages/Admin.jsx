import { mockAdminStats } from '../data/mockEmails';
import { Users, HardDrive, Send, Inbox as InboxIcon, AlertTriangle, XCircle, ShieldAlert } from 'lucide-react';

export default function Admin() {
  const cards = [
    { title: 'Total Active Mailboxes', value: mockAdminStats.totalMailboxes, icon: <Users /> },
    { title: 'Storage Used', value: mockAdminStats.storageUsed, icon: <HardDrive /> },
    { title: 'Emails Sent Today', value: mockAdminStats.emailsSentToday, icon: <Send /> },
    { title: 'Emails Received Today', value: mockAdminStats.emailsReceivedToday, icon: <InboxIcon /> },
    { title: 'Spam Blocked', value: mockAdminStats.spamBlocked, icon: <AlertTriangle /> },
    { title: 'Failed Deliveries', value: mockAdminStats.failedDeliveries, icon: <XCircle /> },
    { title: 'Security Alerts', value: mockAdminStats.securityAlerts, icon: <ShieldAlert color="var(--danger-color)" /> },
  ];

  return (
    <div style={{ width: '100%', overflowY: 'auto' }}>
      <div style={{ padding: '24px 24px 0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>MAMAS Admin Console</h2>
        <button className="btn-primary">Manage Users</button>
      </div>
      <div className="admin-grid">
        {cards.map((card, index) => (
          <div key={index} className="admin-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="admin-card-title">{card.title}</span>
              <div style={{ color: 'var(--text-muted)' }}>{card.icon}</div>
            </div>
            <div className="admin-card-value">{card.value}</div>
          </div>
        ))}
      </div>
      
      <div style={{ padding: '0 24px 24px 24px' }}>
        <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', border: `1px solid var(--border-color)` }}>
          <h3 style={{ marginBottom: '16px' }}>Recent Audit Logs</h3>
          <p style={{ color: 'var(--text-muted)' }}>No suspicious activities detected in the last 24 hours. The MAMAS domain is fully protected by TLS 1.3 and advanced spam filters.</p>
        </div>
      </div>
    </div>
  );
}
