const { ImapFlow } = require('imapflow');
const simpleParser = require('mailparser').simpleParser;

exports.getEmails = async (req, res) => {
  // Jika kredensial belum diset, kembalikan error yang jelas
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'admin@mr0xred.my.id') {
    return res.status(500).json({
      error: 'Kredensial email belum dikonfigurasi.',
      message: 'Silakan *rename* file .env.example menjadi .env dan isi dengan password asli Anda.'
    });
  }

  const client = new ImapFlow({
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT || '993'),
    secure: process.env.IMAP_TLS === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    logger: false
  });

  try {
    await client.connect();

    let emails = [];
    
    // Fungsi pembantu untuk mengambil dari suatu folder
    const fetchFromFolder = async (folderPath) => {
      let mailbox;
      try {
        mailbox = await client.getMailboxLock(folderPath);
        let totalMessages = client.mailbox.exists;
        if (totalMessages === 0) return; // Kosong

        let startSeq = Math.max(1, totalMessages - 19);
        
        for await (let message of client.fetch(`${startSeq}:*`, { source: true, envelope: true, flags: true })) {
          const parsed = await simpleParser(message.source);
          emails.push({
            id: `${folderPath}-${message.uid}`, // Supaya unik antar folder
            sender: parsed.from?.value[0]?.address || 'Unknown',
            senderName: parsed.from?.value[0]?.name || 'Unknown',
            subject: parsed.subject || '(Tanpa Subjek)',
            snippet: parsed.text ? parsed.text.substring(0, 100) + '...' : '',
            body: parsed.text || parsed.html || 'Email kosong.',
            date: parsed.date ? parsed.date.toISOString() : new Date().toISOString(),
            isRead: message.flags ? message.flags.has('\\Seen') : false,
            isStarred: message.flags ? message.flags.has('\\Flagged') : false,
            labels: [folderPath.replace('[Gmail]/', '').toLowerCase()],
            threadId: `t${message.uid}`,
            timestamp: parsed.date ? parsed.date.getTime() : Date.now()
          });
        }
      } catch (err) {
        console.error(`Gagal menarik dari ${folderPath}:`, err.message);
      } finally {
        if (mailbox) mailbox.release();
      }
    };

    // Tarik dari Kotak Masuk dan folder Spam
    await fetchFromFolder('INBOX');
    await fetchFromFolder('[Gmail]/Spam');
    // Beberapa akun Gmail mungkin punya nama lokalisasi, e.g. '[Gmail]/Spam'

    // Urutkan semua email berdasarkan waktu (paling baru di atas)
    emails.sort((a, b) => b.timestamp - a.timestamp);
    
    // Ambil 20 teratas
    emails = emails.slice(0, 20);

    await client.logout();
    res.json(emails);

  } catch (error) {
    console.error('IMAP Error:', error);
    res.status(500).json({ error: 'Gagal terhubung ke server email', details: error.message });
  }
};

const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {
  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Tujuan (to), subjek, dan isi pesan tidak boleh kosong.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Company Mail App" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
    });

    console.log('Message sent: %s', info.messageId);
    res.status(200).json({ success: true, messageId: info.messageId });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Gagal mengirim pesan', details: error.message });
  }
};
