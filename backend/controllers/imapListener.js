const { ImapFlow } = require('imapflow');
const simpleParser = require('mailparser').simpleParser;

exports.initImapListener = async (io) => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'admin@mr0xred.my.id') {
    console.warn('IMAP Listener: Kredensial belum diset, melewati inisialisasi IDLE.');
    return;
  }

  // Fungsi untuk membuat koneksi dan listener untuk satu folder spesifik
  const listenToFolder = async (folderPath) => {
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
      console.log(`IMAP Listener: Terhubung ke server IMAP untuk folder ${folderPath}.`);

      const mailbox = await client.getMailboxLock(folderPath);
      console.log(`IMAP Listener: Mendengarkan email masuk di ${folderPath}...`);

      client.on('exists', async (data) => {
        console.log(`IMAP Listener (${folderPath}): Event 'exists' diterima. Total pesan: ${data.count}`);
        
        try {
          // Ambil pesan terbaru (urutan terakhir)
          for await (let message of client.fetch(`${data.count}`, { source: true, envelope: true, flags: true })) {
            const parsed = await simpleParser(message.source);
            const emailData = {
              id: `${folderPath}-${message.uid}`,
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
              timestamp: parsed.date ? parsed.date.getTime() : Date.now(),
              isNew: true 
            };

            io.emit('new_email', emailData);
            console.log(`IMAP Listener (${folderPath}): Email baru dikirim ke client: ${emailData.subject}`);
          }
        } catch (err) {
          console.error(`IMAP Listener (${folderPath}): Gagal mengambil pesan baru:`, err.message);
        }
      });

      // Handle shutdown gracefully for this client
      process.on('SIGINT', async () => {
        if (mailbox) mailbox.release();
        await client.logout();
      });

    } catch (err) {
      console.error(`IMAP Listener (${folderPath}): Gagal inisialisasi:`, err.message);
    }
  };

  // Jalankan listener untuk INBOX dan folder Spam (menggunakan 2 koneksi terpisah)
  listenToFolder('INBOX');
  listenToFolder('[Gmail]/Spam');
};
