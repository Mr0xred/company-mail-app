export const mockEmails = [
  {
    id: '1',
    sender: 'support@mr0xred.my.id',
    senderName: 'MAMAS Support',
    subject: 'Welcome to your new MAMAS Mailbox',
    snippet: 'Hi there, welcome to your enterprise email dashboard. Here you can manage your communication...',
    body: 'Hi there,\n\nWelcome to your enterprise email dashboard. Here you can manage your communication effectively.\n\nBest regards,\nMAMAS Support Team',
    date: new Date().toISOString(),
    isRead: false,
    isStarred: true,
    labels: ['inbox', 'important'],
    threadId: 't1'
  },
  {
    id: '2',
    sender: 'billing@mr0xred.my.id',
    senderName: 'MAMAS Billing',
    subject: 'Invoice #10294 for Cloud Hosting',
    snippet: 'Your monthly invoice for cloud hosting services has been generated. Please review...',
    body: 'Hello,\n\nYour monthly invoice for cloud hosting services has been generated.\nAmount: $49.00\nDue Date: Next Friday.\n\nThanks,\nBilling Dept',
    date: new Date(Date.now() - 86400000).toISOString(),
    isRead: true,
    isStarred: false,
    labels: ['inbox', 'finance'],
    threadId: 't2'
  },
  {
    id: '3',
    sender: 'marketing@partners.com',
    senderName: 'Partner Marketing',
    subject: 'Q3 Partnership Opportunities',
    snippet: 'We would love to discuss the upcoming partnership opportunities for Q3. Are you available...',
    body: 'Hi Team,\n\nWe would love to discuss the upcoming partnership opportunities for Q3. Are you available for a quick call next week?\n\nCheers,\nMarketing',
    date: new Date(Date.now() - 172800000).toISOString(),
    isRead: true,
    isStarred: true,
    labels: ['inbox'],
    threadId: 't3'
  },
  {
    id: '4',
    sender: 'alerts@security.mr0xred.my.id',
    senderName: 'Security Alert',
    subject: 'New login from unknown device',
    snippet: 'We detected a new login to your account from an unknown device in Mumbai, India.',
    body: 'Security Alert,\n\nWe detected a new login to your account from an unknown device in Mumbai, India. If this was not you, please secure your account immediately.\n\n- MAMAS Security',
    date: new Date(Date.now() - 259200000).toISOString(),
    isRead: false,
    isStarred: false,
    labels: ['inbox', 'urgent'],
    threadId: 't4'
  }
];

export const mockAdminStats = {
  totalMailboxes: 142,
  storageUsed: '45.2 GB',
  emailsSentToday: 1240,
  emailsReceivedToday: 3850,
  spamBlocked: 852,
  failedDeliveries: 12,
  aliasesCount: 45,
  securityAlerts: 3
};
