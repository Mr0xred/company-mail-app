require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const emailController = require('./controllers/emailController');
const { initImapListener } = require('./controllers/imapListener');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/emails', emailController.getEmails);
app.post('/api/emails/send', emailController.sendEmail);

// Server Setup with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('Frontend client terhubung ke WebSockets');
  socket.on('disconnect', () => {
    console.log('Frontend client terputus');
  });
});

// Mulai IMAP Listener yang akan mengirim event ke io
initImapListener(io);

server.listen(PORT, () => {
  console.log(`Backend Server berjalan di http://localhost:${PORT}`);
  console.log(`Menggunakan akun: ${process.env.EMAIL_USER || 'Belum diset di .env'}`);
});
